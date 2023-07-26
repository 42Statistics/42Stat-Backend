import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, SortOrder } from 'mongoose';
import { AggrNumeric, addRank } from 'src/common/db/common.db.aggregation';
import { findAllAndLean, type QueryArgs } from 'src/common/db/common.db.query';
import type { UserRank } from 'src/common/models/common.user.model';
import { EvalLogSortOrder } from 'src/page/evalLog/dtos/evalLog.dto.getEvalLog';
import type { EvalLog } from 'src/page/evalLog/models/evalLog.model';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import {
  addUserPreview,
  lookupCursusUser,
} from '../cursusUser/db/cursusUser.database.aggregate';
import { NETWHAT_PREVIEW, PROJECT_BASE_URL } from '../project/project.service';
import { lookupScaleTeams } from './db/scaleTeam.database.aggregate';
import { scale_team } from './db/scaleTeam.database.schema';

export const OUTSTANDING_FLAG_ID = 9;

@Injectable()
export class ScaleTeamService {
  constructor(
    @InjectModel(scale_team.name)
    private readonly scaleTeamModel: Model<scale_team>,
    private readonly cursusUserService: CursusUserService,
  ) {}

  async findAllAndLean(
    queryArgs?: QueryArgs<scale_team>,
  ): Promise<scale_team[]> {
    return await findAllAndLean(queryArgs)(this.scaleTeamModel);
  }

  async evalCount(filter?: FilterQuery<scale_team>): Promise<number> {
    if (!filter) {
      return await this.scaleTeamModel.estimatedDocumentCount();
    }

    return await this.scaleTeamModel.countDocuments(filter);
  }

  async evalCountRanking(
    filter?: FilterQuery<scale_team>,
  ): Promise<UserRank[]> {
    const aggregate = this.cursusUserService.aggregate<UserRank>();

    return await aggregate
      .append(
        lookupScaleTeams(
          'user.id',
          'corrector.id',
          filter ? [{ $match: filter }] : undefined,
        ),
      )
      .addFields({ value: { $size: '$scale_teams' } })
      .append(addRank())
      .append(addUserPreview('user'))
      .project({
        _id: 0,
        userPreview: 1,
        value: 1,
        rank: 1,
      });
  }

  async averageFinalMark(userId: number): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    const [finalMarkAggr] = await aggregate
      .match({
        'corrector.id': userId,
        finalMark: { $ne: null },
      })
      .group({
        _id: 'result',
        value: { $avg: '$finalMark' },
      })
      .project({
        _id: 0,
        value: { $round: '$value' },
      });

    return finalMarkAggr?.value ?? 0;
  }

  async averageReviewLength(
    field: 'comment' | 'feedback',
    filter?: FilterQuery<scale_team>,
  ): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    const [reviewAggr] = await aggregate
      .match({
        ...filter,
        [`${field}`]: { $ne: null },
      })
      .group({
        _id: 'result',
        value: { $avg: { $strLenCP: `$${field}` } },
      })
      .project({
        _id: 0,
        value: { $round: '$value' },
      });

    return reviewAggr?.value ?? 0;
  }

  /**
   *
   * @returns [총 평가 시간, 총 평가 횟수]
   */
  async durationInfo(
    filter?: FilterQuery<scale_team>,
  ): Promise<[number, number]> {
    const aggregate = this.scaleTeamModel.aggregate<
      AggrNumeric & { count: number }
    >();

    if (filter) {
      aggregate.match(filter);
    }

    const [durationInfo] = await aggregate.group({
      _id: 'result',
      value: {
        $sum: {
          $dateDiff: {
            startDate: '$beginAt',
            endDate: '$filledAt',
            unit: 'minute',
          },
        },
      },
      count: { $count: {} },
    });

    return durationInfo ? [durationInfo.value, durationInfo.count] : [0, 0];
  }

  async evalLogs(
    limit: number,
    sortOrder: EvalLogSortOrder,
    filter?: FilterQuery<scale_team>,
  ): Promise<EvalLog[]> {
    const aggregate = this.scaleTeamModel.aggregate<EvalLog>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
      .sort(evalLogSort(sortOrder))
      .limit(limit)
      .lookup({
        from: 'projects',
        localField: 'team.projectId',
        foreignField: 'id',
        as: 'projects',
      })
      .append(lookupCursusUser('corrector.id', 'user.id'))
      .addFields({
        project: { $first: '$projects' },
        corrector: { $first: '$cursus_users' },
      })
      .project({
        _id: 0,
        id: '$id',
        header: {
          corrector: {
            id: '$corrector.user.id',
            login: '$corrector.user.login',
            imgUrl: '$corrector.user.image.link',
          },
          teamPreview: {
            id: '$team.id',
            name: '$team.name',
            url: {
              $concat: [
                PROJECT_BASE_URL,
                '/',
                { $toString: '$team.projectId' },
                '/projects_users/',
                {
                  $toString: {
                    $first: '$team.users.projectsUserId',
                  },
                },
              ],
            },
          },
          beginAt: '$beginAt',
          projectPreview: {
            $cond: {
              if: { $eq: [{ $size: '$projects' }, 0] },
              then: NETWHAT_PREVIEW,
              else: {
                id: '$project.id',
                name: '$project.name',
                url: {
                  $concat: [
                    PROJECT_BASE_URL,
                    '/',
                    { $toString: '$project.id' },
                  ],
                },
              },
            },
          },
          flag: {
            id: '$flag.id',
            name: '$flag.name',
            isPositive: '$flag.positive',
          },
        },
        correctorReview: {
          mark: '$finalMark',
          review: '$comment',
        },
        correctedsReview: {
          $cond: {
            if: { $eq: ['$feedback', null] },
            then: null,
            else: {
              mark: { $max: '$feedbacks.rating' },
              review: '$feedback',
            },
          },
        },
      });
  }
}

const evalLogSort = (
  sortOrder: EvalLogSortOrder,
): Record<string, SortOrder> => {
  switch (sortOrder) {
    case EvalLogSortOrder.BEGIN_AT_ASC:
      return {
        beginAt: 1,
        id: 1,
      };
    case EvalLogSortOrder.BEGIN_AT_DESC:
      return {
        beginAt: -1,
        id: -1,
      };
  }
};
