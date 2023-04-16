import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AggrNumeric } from 'src/common/db/common.db.aggregation';
import { UserRanking } from 'src/common/models/common.user.model';
import { Util } from 'src/util';
import { scale_teams } from './db/scaleTeams.database.schema';

@Injectable()
export class ScaleTeamsService {
  constructor(
    @InjectModel(scale_teams.name)
    private scaleTeamModel: Model<scale_teams>,
  ) {}

  //todo: findAll사용하는 서비스 로직 모두 aggreage로 변경 후 삭제
  async findAll(): Promise<scale_teams[]> {
    return await this.scaleTeamModel.find();
  }

  async find(
    filter?: FilterQuery<scale_teams>,
    /* todo
    start,limit?: number
    */
  ): Promise<scale_teams[]> {
    return await this.scaleTeamModel.find(filter ?? {});
  }

  async getEvalCnt(filter?: FilterQuery<scale_teams>): Promise<number> {
    if (!filter) {
      return await this.scaleTeamModel.estimatedDocumentCount();
    }

    return await this.scaleTeamModel.countDocuments(filter);
  }

  async getEvalCntRank(
    filter?: FilterQuery<scale_teams>,
  ): Promise<UserRanking[]> {
    const aggregate = this.scaleTeamModel.aggregate<UserRanking>();

    if (filter) {
      aggregate.append({ $match: filter });
    }

    const rankAggr = await aggregate
      .group({
        _id: '$corrector.id',
        login: { $first: '$corrector.login' },
        imgUrl: { $first: '$corrector.url' },
        value: { $sum: 1 },
      })
      .sort({ value: -1 })
      .limit(3)
      .project({
        _id: 0,
        userPreview: {
          id: '$_id',
          login: '$login',
          imgUrl: '$imgUrl',
        },
        value: '$value',
      })
      .exec();

    return rankAggr;
  }

  async getAverageFinalMark(uid: number): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    // todo: 아무 제약 조건이 없다면 200ms 정도 걸립니다.
    // project를 사용해서 필드를 한번에 계산할 수 있지만, query 필요 시간이 유의미하게 증가합니다.
    const finalMarkAggr = await aggregate
      .match({
        'corrector.id': uid,
        finalMark: { $ne: null },
      })
      .group({
        _id: 'result',
        value: { $avg: '$finalMark' },
      })
      .exec();

    return finalMarkAggr.length ? Math.round(finalMarkAggr[0].value) : 0;
  }

  async getAverageReviewLength(
    field: 'comment' | 'feedback',
    filter?: FilterQuery<scale_teams>,
  ): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    // todo: 아무 제약 조건이 없다면 200ms 정도 걸립니다.
    // project를 사용해서 필드를 한번에 계산할 수 있지만, query 필요 시간이 유의미하게 증가합니다.
    const reviewAggr = await aggregate
      .match({
        ...filter,
        [`${field}`]: { $ne: null },
      })
      .group({
        _id: 'result',
        value: { $avg: { $strLenCP: `$${field}` } },
      })
      .exec();

    return reviewAggr.length ? Math.round(reviewAggr[0].value) : 0;
  }

  async getAverageDurationMinute(
    filter?: FilterQuery<scale_teams>,
  ): Promise<number> {
    const aggregate = this.scaleTeamModel.aggregate<AggrNumeric>();

    // todo: 아무 제약 조건이 없다면 200ms 정도 걸립니다.
    // project를 사용해서 필드를 한번에 계산할 수 있지만, query 필요 시간이 유의미하게 증가합니다.
    const sumOfDuration = await aggregate
      .match({
        filledAt: { $ne: null },
        ...filter,
      })
      .group({
        _id: 'result',
        value: { $avg: { $subtract: ['$filledAt', '$beginAt'] } },
      })
      .exec();

    return sumOfDuration.length
      ? Math.round(sumOfDuration[0].value / Util.Time.MIN)
      : 0;
  }

  // todo: erase
  // async evalInfos(args: GetEvalInfoArgs): Promise<PersonalScaleTeam[]> {
  //   const matchPipline = () => {
  //     switch (args.evalUserType) {
  //       case EvalUserEnum.ANY:
  //         return ScaleTeamsPipeline.evalInfo.any(args);
  //       case EvalUserEnum.CORRECTOR:
  //         return ScaleTeamsPipeline.evalInfo.corrector(args);
  //       case EvalUserEnum.CORRECTED:
  //         return ScaleTeamsPipeline.evalInfo.corrected(args);
  //     }
  //   };

  //   const evalInfos = await this.scaleTeamModel.aggregate([
  //     matchPipline(),
  //     {
  //       $match: {
  //         $expr: {
  //           $cond: {
  //             if: {
  //               $eq: [args.outstandingOnly, true],
  //             },
  //             then: {
  //               $eq: ['$flag.id', 9],
  //             },
  //             else: {},
  //           },
  //         },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 'result',
  //         corrector: {
  //           id: '$corrector.id',
  //           login: '$corrector.login',
  //           imgUrl: '$corrector.url',
  //           comment: '$comment',
  //           correctorRate: {
  //             $ifNull: [
  //               {
  //                 $arrayElemAt: ['$feedbacks.rating', 0],
  //               },
  //               0,
  //             ],
  //           },
  //         },
  //         feedback: '$feedback',
  //         beginAt: 1,
  //         finalMark: 1,
  //         flag: {
  //           id: '$flag.id',
  //           name: '$flag.name',
  //           isPositive: '$flag.positive',
  //         },
  //         projectPreview: {
  //           id: '$team.projectId',
  //         },
  //         teamPreview: {
  //           id: '$team.id',
  //           name: '$team.name',
  //           url: '$team.url',
  //         },
  //       },
  //     },
  //     {
  //       $limit: 5, //: page
  //     },
  //     {
  //       $lookup: {
  //         from: 'projects',
  //         localField: 'projectPreview.id',
  //         foreignField: 'id',
  //         as: 'projectPreview',
  //       },
  //     },
  //     {
  //       $addFields: {
  //         projectPreview: {
  //           $first: '$projectPreview',
  //         },
  //       },
  //     },
  //   ]);

  //   return evalInfos ?? [];
  // }
}
