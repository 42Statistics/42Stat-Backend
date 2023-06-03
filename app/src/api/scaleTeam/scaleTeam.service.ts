import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumeric } from 'src/common/db/common.db.aggregation';
import type { UserRanking } from 'src/common/models/common.user.model';
import type {
  EvalLog,
  EvalLogsPaginated,
} from 'src/page/evalLog/models/evalLog.model';
import { PaginationCursorService } from 'src/pagination/cursor/pagination.cursor.service';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { addUserPreview } from '../cursusUser/db/cursusUser.database.aggregate';
import {
  lookupScaleTeams,
  rankEvalCount,
} from './db/scaleTeam.database.aggregate';
import { scale_team } from './db/scaleTeam.database.schema';

@Injectable()
export class ScaleTeamService {
  constructor(
    @InjectModel(scale_team.name)
    private scaleTeamModel: Model<scale_team>,
    private cursusUserService: CursusUserService,
    private paginationService: PaginationCursorService,
  ) {}

  // async find(
  //   filter: FilterQuery<scale_team> = {},
  //   pageSize: number = 10,
  //   pageNumber: number = 10,
  // ): Promise<scale_team[]> {
  //   if (pageSize < 1 || pageNumber < 1) {
  //     throw new InternalServerErrorException();
  //   }

  //   return await this.scaleTeamModel
  //     .find(filter)
  //     .sort({ beginAt: -1 })
  //     .skip((pageNumber - 1) * pageSize)
  //     .limit(pageSize);
  // }

  async evalCount(filter?: FilterQuery<scale_team>): Promise<number> {
    if (!filter) {
      return await this.scaleTeamModel.estimatedDocumentCount();
    }

    return await this.scaleTeamModel.countDocuments(filter);
  }

  // total의 경우 5초, 기간 한정하는 경우 1초 이내
  async evalCountRank(
    filter?: FilterQuery<scale_team>,
  ): Promise<UserRanking[]> {
    const aggregate = this.cursusUserService.aggregate<UserRanking>();

    return await aggregate
      .append(
        lookupScaleTeams(
          'user.id',
          'corrector.id',
          filter ? [{ $match: filter }] : undefined,
        ),
      )
      .addFields({ value: { $size: '$scale_teams' } })
      .append(...rankEvalCount)
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

  async averageDurationMinute(
    filter?: FilterQuery<scale_team>,
  ): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    const [sumOfDuration] = await aggregate
      .match({
        filledAt: { $ne: null },
        ...filter,
      })
      .group({
        _id: 'result',
        value: {
          $avg: {
            $dateDiff: {
              startDate: '$beginAt',
              endDate: '$filledAt',
              unit: 'minute',
            },
          },
        },
      })
      .project({
        _id: 0,
        value: { $round: '$value' },
      });

    return sumOfDuration?.value ?? 0;
  }

  async evalLogs(
    pageSize: number,
    pageNumber: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<EvalLogsPaginated> {
    const aggregate = this.scaleTeamModel.aggregate<EvalLog>();

    const evalLogsAggr = await aggregate
      // todo: 평가 취소인 경우에 대한 처리를 할 수 있음
      .match({ ...filter, feedback: { $ne: null }, comment: { $ne: null } })
      .facet({
        slicedData: [
          // { $match: {} },
          { $sort: { beginAt: -1 } },
          { $skip: (pageNumber - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [{ $group: { _id: null, count: { $count: {} } } }],
      })
      .unwind({ path: '$slicedData' })
      .lookup({
        from: 'projects',
        localField: 'slicedData.team.projectId',
        foreignField: 'id',
        as: 'projectPreview',
      })
      .addFields({ projectPreview: { $first: '$projectPreview' } })
      .lookup({
        from: 'users',
        localField: 'slicedData.corrector.id',
        foreignField: 'id',
        as: 'joinedCorrector',
      })
      .project({
        _id: 0,
        header: {
          corrector: {
            id: '$slicedData.corrector.id',
            login: '$slicedData.corrector.login',
            imgUrl: { $first: '$joinedCorrector.image.link' },
          },
          teamPreview: {
            id: '$slicedDatateam.id',
            name: '$slicedData.team.name',
            url: {
              $concat: [
                'https://projects.intra.42.fr/projects/',
                { $toString: '$projectPreview.id' },
                '/projects_users/',
                {
                  $toString: {
                    $first: '$slicedData.team.users.projectsUserId',
                  },
                },
              ],
            },
          },
          beginAt: '$slicedData.beginAt',
          projectPreview: {
            id: '$projectPreview.id',
            name: '$projectPreview.name',
            url: {
              $concat: [
                'https://projects.intra.42.fr/projects/',
                { $toString: '$projectPreview.id' },
              ],
            },
          },
          flag: {
            id: '$slicedData.flag.id',
            name: '$slicedData.flag.name',
            isPositive: '$slicedData.flag.positive',
          },
        },
        correctorReview: {
          mark: '$slicedData.finalMark',
          review: '$slicedData.comment',
        },
        correctedsReview: {
          mark: { $max: '$slicedData.feedbacks.rating' },
          review: '$slicedData.feedback',
        },
      });

    const totalCount = await this.scaleTeamModel.count({
      ...filter,
      feedback: { $ne: null },
      comment: { $ne: null },
    });

    return this.paginationService.generatePage<EvalLog>(
      evalLogsAggr,
      totalCount,
      {
        pageSize,
        pageNumber,
      },
      'header',
    );
  }
}
