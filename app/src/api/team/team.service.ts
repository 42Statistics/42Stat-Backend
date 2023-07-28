import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumeric } from 'src/common/db/common.db.aggregation';
import { addRank } from 'src/common/db/common.db.aggregation';
import type { Rate } from 'src/common/models/common.rate.model';
import type { UserRank } from 'src/common/models/common.user.model';
import { API_CONFIG, type ApiConfig } from 'src/config/api';
import type { ResultPerRank } from 'src/page/home/team/models/home.team.model';
import {
  TeamStatus,
  UserTeam,
} from 'src/page/personal/general/models/personal.general.model';
import {
  conditionalProjectPreview,
  lookupProjects,
} from '../project/db/project.database.aggregate';
import type { project } from '../project/db/project.database.schema';
import { addUserPreview, lookupUser } from '../user/db/user.database.aggregate';
import { team } from './db/team.database.schema';

@Injectable()
export class TeamService {
  private readonly PROJECT_CIRCLES: Record<number, number>;

  constructor(
    @InjectModel(team.name)
    private readonly teamModel: Model<team>,
    private readonly configService: ConfigService,
  ) {
    this.PROJECT_CIRCLES =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).PROJECT_CIRCLES;
  }

  async count(filter?: FilterQuery<team>): Promise<number> {
    if (!filter) {
      return await this.teamModel.estimatedDocumentCount();
    }

    return await this.teamModel.countDocuments(filter);
  }

  async userTeams(
    userId: number,
  ): Promise<(UserTeam & Pick<team, 'createdAt'>)[]> {
    const aggregate = this.teamModel.aggregate<
      Omit<UserTeam, 'status'> & Pick<team, 'status' | 'createdAt'>
    >();

    const teamsAggr = await aggregate
      .match({ 'users.id': userId })
      .append(lookupProjects('projectId', 'id'))
      .addFields({
        users: {
          $filter: {
            input: '$users',
            as: 'user',
            cond: { $eq: ['$$user.id', userId] },
          },
        },
        project: { $first: '$projects' },
      })
      .project({
        _id: 0,
        id: 1,
        name: 1,
        occurrence: { $first: '$users.occurrence' },
        projectPreview: {
          ...conditionalProjectPreview('projectId', 'project'),
        },
        status: 1,
        lastEventTime: {
          $max: [
            '$createdAt',
            '$lockedAt',
            '$closedAt',
            {
              $cond: [
                { $eq: ['$status', 'finished'] },
                { $max: '$scaleTeams.filledAt' },
                null,
              ],
            },
            { $max: '$teamsUploads.createdAt' },
          ],
        },
        isValidated: '$validated?',
        finalMark: 1,
        createdAt: 1,
      })
      .sort({ lastEventTime: -1 });

    return teamsAggr.map((team) => ({
      ...team,
      projectPreview: {
        ...team.projectPreview,
        circle: this.PROJECT_CIRCLES[team.projectPreview.id],
      },
      status: convertStauts(team.status),
    }));
  }

  /**
   *
   * @return number[] 0번째에 pass, 1번째에 fail 숫자를 담은 배열을 반환합니다.
   */
  async validatedRate(filter?: FilterQuery<team>): Promise<Rate> {
    const aggregate = this.teamModel.aggregate<
      { _id: boolean } & AggrNumeric
    >();

    const validatedRateAggr = await aggregate
      .match({ ...filter, status: 'finished' })
      .group({ _id: '$validated?', value: { $count: {} } });

    const pass = validatedRateAggr.find(({ _id }) => _id === true)?.value ?? 0;
    const fail = validatedRateAggr.find(({ _id }) => _id === false)?.value ?? 0;

    const validatedRate: Rate = {
      total: pass + fail,
      fields: [
        { key: 'pass', value: pass },
        { key: 'fail', value: fail },
      ],
    };

    return validatedRate;
  }

  async registeredCount(filter?: FilterQuery<team>): Promise<number> {
    const aggregate = this.teamModel.aggregate<AggrNumeric>();

    if (filter) {
      aggregate.match(filter);
    }

    const registeredCountAggr = await aggregate.group({
      _id: 'result',
      value: { $sum: { $size: '$users' } },
    });

    return registeredCountAggr.length ? registeredCountAggr[0].value : 0;
  }

  async teamMatesUid(
    targetUid: number,
  ): Promise<{ userId: number; value: number }[]> {
    const aggregate = this.teamModel.aggregate<
      { userId: number } & AggrNumeric
    >();

    return await aggregate
      .match({ 'users.id': targetUid })
      .unwind({ path: 'users' })
      .group({ _id: '$users.id', value: { $count: {} } })
      .match({ _id: { $ne: targetUid } })
      .project({ _id: 0, userId: '$_id', value: 1 });
  }

  async averagePassFinalMark(projectId: number): Promise<number> {
    const aggregate = this.teamModel.aggregate<AggrNumeric>();

    const [averagePassFinalMark] = await aggregate
      .match({
        projectId: projectId,
        status: 'finished',
        'validated?': true,
      })
      .group({
        _id: 'result',
        value: { $avg: '$finalMark' },
      })
      .project({
        _id: 0,
        value: { $floor: '$value' },
      });

    return averagePassFinalMark?.value ?? 0;
  }

  async examResult(
    start: Date,
    end: Date,
    targetProjects: project[],
  ): Promise<ResultPerRank[]> {
    const aggregate = this.teamModel.aggregate<{
      projectId: number;
      total: number;
      passUser: number;
      failUser: number;
    }>();

    const projectIds = targetProjects.map((targetProject) => targetProject.id);

    const examResults = await aggregate
      .match({
        projectId: { $in: projectIds },
        closedAt: { $gte: start, $lt: end },
      })
      .group({
        _id: '$projectId',
        total: { $count: {} },
        passUser: { $sum: { $cond: [{ $eq: ['$finalMark', 100] }, 1, 0] } },
      })
      .project({
        _id: 0,
        projectId: '$_id',
        total: 1,
        passUser: 1,
        failUser: { $subtract: ['$total', '$passUser'] },
      });

    return targetProjects.map((project) => {
      const examResult = examResults.find(
        ({ projectId }) => project.id === projectId,
      );

      return {
        rank: parseInt(project.name[project.name.length - 1]),
        rate: {
          total: examResult?.total ?? 0,
          fields: [
            { key: 'pass', value: examResult?.passUser ?? 0 },
            { key: 'fail', value: examResult?.failUser ?? 0 },
          ],
        },
      };
    });
  }

  async destinyRanking(userId: number, limit: number): Promise<UserRank[]> {
    const aggregate = this.teamModel.aggregate<UserRank>();

    return await aggregate
      .match({
        $or: [{ 'users.id': userId }, { 'scaleTeams.corrector.id': userId }],
      })
      .addFields({
        users: {
          $cond: {
            if: { $in: [userId, '$scaleTeams.corrector.id'] },
            then: { $first: '$users.id' },
            else: {
              $concatArrays: [
                {
                  $filter: {
                    input: {
                      $concatArrays: ['$scaleTeams.corrector.id', '$users.id'],
                    },
                    cond: { $ne: ['$$this', userId] },
                  },
                },
              ],
            },
          },
        },
      })
      .unwind('$users')
      .group({
        _id: '$users',
        value: { $count: {} },
      })
      .append(addRank())
      .limit(limit)
      .append(lookupUser('_id', 'id'))
      .unwind('users')
      .append(addUserPreview('users'))
      .project({
        _id: 0,
        value: 1,
        rank: 1,
        userPreview: 1,
      });
  }
}

const convertStauts = (status: team['status']): TeamStatus => {
  switch (status) {
    case 'creating_group':
      return TeamStatus.REGISTERED;
    case 'in_progress':
      return TeamStatus.IN_PROGRESS;
    case 'waiting_for_correction':
      return TeamStatus.WAITING_FOR_CORRECTION;
    case 'finished':
      return TeamStatus.FINISHED;
  }
};
