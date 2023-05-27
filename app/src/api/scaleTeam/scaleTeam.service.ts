import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumeric } from 'src/common/db/common.db.aggregation';
import { UserRanking } from 'src/common/models/common.user.model';
import { EvalLog, EvalLogsPaginated } from 'src/evalLog/models/evalLog.model';
import { generatePage } from 'src/pagination/pagination.service';
import { scale_team } from './db/scaleTeam.database.schema';

@Injectable()
export class ScaleTeamService {
  constructor(
    @InjectModel(scale_team.name)
    private scaleTeamModel: Model<scale_team>,
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

  async getEvalCount(filter?: FilterQuery<scale_team>): Promise<number> {
    if (!filter) {
      return await this.scaleTeamModel.estimatedDocumentCount();
    }

    return await this.scaleTeamModel.countDocuments(filter);
  }

  async getEvalCountRank(
    filter?: FilterQuery<scale_team>,
  ): Promise<UserRanking[]> {
    const aggregate = this.scaleTeamModel.aggregate<UserRanking>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
      .group({
        _id: '$corrector.id',
        login: { $first: '$corrector.login' },
        value: { $count: {} },
      })
      .sort({ value: -1 })
      .limit(3)
      .lookup({
        from: 'users',
        localField: '_id',
        foreignField: 'id',
        as: 'user',
      })
      .project({
        _id: 0,
        userPreview: {
          id: '$_id',
          login: '$login',
          imgUrl: { $first: '$user.image.link' },
        },
        value: '$value',
      });
  }

  async getAverageFinalMark(uid: number): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    const finalMarkAggr = await aggregate
      .match({
        'corrector.id': uid,
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

    return finalMarkAggr.length ? finalMarkAggr[0].value : 0;
  }

  async getAverageReviewLength(
    field: 'comment' | 'feedback',
    filter?: FilterQuery<scale_team>,
  ): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    const reviewAggr = await aggregate
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

    return reviewAggr.length ? reviewAggr[0].value : 0;
  }

  async getAverageDurationMinute(
    filter?: FilterQuery<scale_team>,
  ): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    const sumOfDuration = await aggregate
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

    return sumOfDuration.length ? sumOfDuration[0].value : 0;
  }

  async getEvalLogs(
    pageSize: number,
    pageNumber: number,
    filter?: FilterQuery<scale_team>,
  ): Promise<EvalLogsPaginated> {
    const aggregate = this.scaleTeamModel.aggregate<EvalLog>();

    const evalLogsAggr = await aggregate
      // todo: 평가 취소인 경우에 대한 처리를 할 수 있음
      .match({ ...filter, feedback: { $ne: null }, comment: { $ne: null } })
      .sort({ beginAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lookup({
        from: 'projects',
        localField: 'team.projectId',
        foreignField: 'id',
        as: 'projectPreview',
      })
      .addFields({ projectPreview: { $first: '$projectPreview' } })
      .lookup({
        from: 'users',
        localField: 'corrector.id',
        foreignField: 'id',
        as: 'joinedCorrector',
      })
      .project({
        _id: 0,
        header: {
          corrector: {
            id: '$corrector.id',
            login: '$corrector.login',
            imgUrl: { $first: '$joinedCorrector.image.link' },
          },
          teamPreview: {
            id: '$team.id',
            name: '$team.name',
            url: {
              $concat: [
                'https://projects.intra.42.fr/projects/',
                { $toString: '$projectPreview.id' },
                '/projects_users/',
                { $toString: { $first: '$team.users.projectsUserId' } },
              ],
            },
          },
          beginAt: '$beginAt',
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
            id: '$flag.id',
            name: '$flag.name',
            isPositive: '$flag.positive',
          },
        },
        correctorReview: { mark: '$finalMark', review: '$comment' },
        correctedsReview: {
          mark: { $max: '$feedbacks.rating' },
          review: '$feedback',
        },
      });

    const totalCount = await this.scaleTeamModel.count({
      ...filter,
      feedback: { $ne: null },
      comment: { $ne: null },
    });

    return generatePage(evalLogsAggr, totalCount, { pageSize, pageNumber });
  }
}
