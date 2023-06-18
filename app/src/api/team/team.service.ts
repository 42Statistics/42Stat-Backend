import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumeric } from 'src/common/db/common.db.aggregation';
import type { Rate } from 'src/common/models/common.rate.model';
import type { ResultPerRank } from 'src/page/home/team/models/home.team.model';
import {
  TeamStatus,
  UserTeam,
} from 'src/page/personal/general/models/personal.general.model';
import { StatDate } from 'src/statDate/StatDate';
import { lookupProjects } from '../project/db/project.database.aggregate';
import { NETWHAT_PREVIEW } from '../project/project.service';
import { team } from './db/team.database.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(team.name)
    private teamModel: Model<team>,
  ) {}

  async teamCount(filter?: FilterQuery<team>): Promise<number> {
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
        projects: { $first: '$projects' },
      })
      .project({
        _id: 0,
        id: 1,
        name: 1,
        occurrence: { $first: '$users.occurrence' },
        projectPreview: {
          id: '$projects.id',
          name: '$projects.name',
          // todo: project 꺼 사용
          url: {
            $concat: [
              'https://api.intra.42.fr/v2/projects/',
              { $toString: '$projectId' },
            ],
          },
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
      projectPreview: team.projectPreview.id
        ? team.projectPreview
        : NETWHAT_PREVIEW,
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
    targetBeginAt: Date,
    nextBeginAt: Date = new StatDate(),
    projectIds: number[],
  ): Promise<ResultPerRank[]> {
    const aggregate = this.teamModel.aggregate<{
      projectId: number;
      total: number;
      passUser: number;
      failUser: number;
    }>();

    const examResults = await aggregate
      .match({
        projectId: { $in: projectIds },
        closedAt: { $gte: targetBeginAt, $lt: nextBeginAt },
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

    return projectIds.map((id) => {
      const examResult = examResults.find((result) => result.projectId === id);

      return {
        rank: id,
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
