import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, SortOrder } from 'mongoose';
import type { UserRank } from 'src/common/models/common.user.model';
import {
  AggrNumeric,
  addRank,
} from 'src/database/mongoose/database.mongoose.aggregation';
import {
  findAllAndLean,
  type QueryArgs,
} from 'src/database/mongoose/database.mongoose.query';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { EvalLogSortOrder } from 'src/page/evalLog/dtos/evalLog.dto.getEvalLog';
import type { EvalLog } from 'src/page/evalLog/models/evalLog.model';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import {
  concatProjectUserUrl,
  conditionalProjectPreview,
} from '../project/db/project.database.aggregate';
import { addUserPreview, lookupUser } from '../user/db/user.database.aggregate';
import {
  evalCountDateRangeFilter,
  lookupScaleTeams,
} from './db/scaleTeam.database.aggregate';
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
    return await findAllAndLean(this.scaleTeamModel, queryArgs);
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

  async averageReviewLengthRankingByDateRange(
    field: 'comment' | 'feedback',
    dateRange?: DateRange,
  ): Promise<UserRank[]> {
    const aggregate = this.cursusUserService.aggregate<
      Omit<UserRank, 'rank'> & { count: number }
    >();

    const fieldMap = {
      comment: 'corrector',
      feedback: 'correcteds',
    };

    const target = fieldMap[field];

    const scaleTeamFilter = {
      [field]: { $ne: null },
      ...(dateRange ? evalCountDateRangeFilter(dateRange) : undefined),
    };

    const rawRanking = await aggregate
      .append(
        lookupScaleTeams('user.id', `${target}.id`, [
          { $match: scaleTeamFilter },
          {
            $group: {
              _id: 'result',
              count: { $count: {} },
              value: { $avg: { $strLenCP: `$${field}` } },
            },
          },
        ]),
      )
      .addFields({
        value: {
          $ifNull: [{ $round: { $first: '$scale_teams.value' } }, 0],
        },
      })
      .sort({ value: -1 })
      .append(addUserPreview('user'))
      .project({
        _id: 0,
        userPreview: 1,
        value: 1,
        count: { $first: '$scale_teams.count' },
      });

    const { ranking, zeroValueRanking } = rawRanking.reduce(
      (
        { ranking, prevRank, prevValue, zeroValueRanking },
        { userPreview, value, count },
      ) => {
        if (dateRange || count >= 20) {
          const rank = prevValue === value ? prevRank : ranking.length + 1;

          ranking.push({
            userPreview,
            value,
            rank,
          });

          return {
            ranking,
            prevRank: rank,
            prevValue: value,
            zeroValueRanking,
          };
        }

        zeroValueRanking.push({
          userPreview,
          value: 0,
          rank: Number.MAX_SAFE_INTEGER,
        });

        return { ranking, prevRank, prevValue, zeroValueRanking };
      },
      {
        ranking: new Array<UserRank>(),
        prevRank: 0,
        prevValue: Number.MIN_SAFE_INTEGER,
        zeroValueRanking: new Array<UserRank>(),
      },
    );

    return [...ranking, ...zeroValueRanking];
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
      .append(lookupUser('corrector.id', 'id'))
      .addFields({
        project: { $first: '$projects' },
        corrector: { $first: '$users' },
      })
      .project({
        _id: 0,
        id: '$id',
        header: {
          corrector: {
            id: '$corrector.id',
            login: '$corrector.login',
            imgUrl: '$corrector.image.link',
          },
          teamPreview: {
            id: '$team.id',
            name: '$team.name',
            url: {
              ...concatProjectUserUrl(
                'team.projectId',
                'team.users.projectsUserId',
              ),
            },
          },
          beginAt: '$beginAt',
          projectPreview: {
            ...conditionalProjectPreview('team.projectId', 'project'),
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
