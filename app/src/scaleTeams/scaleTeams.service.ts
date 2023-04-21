import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumeric } from 'src/common/db/common.db.aggregation';
import { UserRanking } from 'src/common/models/common.user.model';
import { EvalLogs } from 'src/evalLogs/models/evalLogs.model';
import { Util } from 'src/util';
import { scale_team } from './db/scaleTeams.database.schema';

@Injectable()
export class ScaleTeamsService {
  constructor(
    @InjectModel(scale_team.name)
    private scaleTeamModel: Model<scale_team>,
  ) {}

  async find(
    filter: FilterQuery<scale_team> = {},
    pageSize: number,
    pageNumber: number,
  ): Promise<scale_team[]> {
    return await this.scaleTeamModel
      .find(filter)
      .skip(pageNumber - 1)
      .limit(pageSize);
  }

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
      aggregate.append({ $match: filter });
    }

    return await aggregate
      .group({
        _id: '$corrector.id',
        login: { $first: '$corrector.login' },
        value: { $sum: 1 },
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
      })
      .exec();
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
      })
      .exec();

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
      })
      .exec();

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
        value: { $avg: { $subtract: ['$filledAt', '$beginAt'] } },
      })
      .project({
        _id: 0,
        value: { $round: { $divide: ['$value', Util.Time.MIN] } },
      })
      .exec();

    return sumOfDuration.length ? sumOfDuration[0].value : 0;
  }

  async getEvalLogs(
    filter: FilterQuery<scale_team>,
    pageSize: number,
    pageNumber: number,
  ): Promise<EvalLogs[]> {
    const aggregate = this.scaleTeamModel.aggregate<EvalLogs>();

    return await aggregate
      .match({
        ...filter,
        // todo: 평가 취소인 경우에 대한 처리를 할 수 있음
        feedback: { $ne: null },
        comment: { $ne: null },
      })
      .sort({ beginAt: -1 })
      .skip(pageNumber - 1)
      .limit(pageSize)
      .lookup({
        from: 'projects',
        localField: 'team.projectId',
        foreignField: 'id',
        as: 'projectPreview',
      })
      .addFields({
        projectPreview: {
          $first: '$projectPreview',
        },
      })
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
                {
                  $toString: '$projectPreview.id',
                },
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
        correctorReview: {
          mark: '$finalMark',
          review: '$comment',
        },
        correctedsReview: {
          mark: {
            $max: '$feedbacks.rating',
          },
          review: '$feedback',
        },
      });
  }
}
