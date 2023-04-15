import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRanking } from 'src/common/models/common.user.model';
import {
  EvalUserEnum,
  GetEvalInfoArgs,
} from 'src/personalEval/dto/getEvalInfo.args';
import { PersonalScaleTeam } from 'src/personalEval/models/personal.eval.scaleTeam.model';
import { Util } from 'src/util';
import { scale_teams } from './db/scaleTeam.database.schema';
import * as ScaleTeamsPipeline from './db/scaleTeams.database.pipeline';

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

  /* Home Page */

  async currWeekEvalCnt(): Promise<number> {
    const currDate = Util.Time.currDate();
    const startOfWeek = Util.Time.startOfWeek(currDate);
    const [currWeekEvalCnt] = await this.scaleTeamModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          beginAt: {
            $gte: new Date(startOfWeek),
          },
        },
      },
      {
        $count: 'count',
      },
    ]);
    return currWeekEvalCnt?.count ?? 0;
  }

  async lastWeekEvalCnt(): Promise<number> {
    const currDate = Util.Time.currDate();
    const startOfCurrWeek = Util.Time.startOfWeek(currDate);
    const startOfLastWeek = Util.Time.startOfLastWeek(currDate);
    const [lastWeekEvalCnt] = await this.scaleTeamModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          beginAt: {
            $gte: new Date(startOfLastWeek),
            $lt: new Date(startOfCurrWeek),
          },
        },
      },
      {
        $count: 'count',
      },
    ]);
    return lastWeekEvalCnt?.count ?? 0;
  }

  async totalEvalCntRank(): Promise<UserRanking[]> {
    return await this.scaleTeamModel.aggregate([
      {
        $group: {
          _id: '$corrector.id',
          login: { $first: '$corrector.login' },
          imgUrl: { $first: '$corrector.url' },
          value: { $sum: 1 },
        },
      },
      {
        $sort: { value: -1 },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          _id: 0,
          userPreview: {
            id: '$_id',
            login: '$login',
            imgUrl: '$imgUrl',
          },
          value: '$value',
        },
      },
    ]);
  }

  async monthlyEvalCntRank(): Promise<UserRanking[]> {
    const currDate = Util.Time.currDate();
    const startOfMonth = Util.Time.startOfMonth(currDate);
    return await this.scaleTeamModel.aggregate([
      {
        $match: {
          beginAt: {
            $gte: new Date(startOfMonth),
          },
        },
      },
      {
        $group: {
          _id: '$corrector.id',
          login: {
            $first: '$corrector.login',
          },
          imgUrl: {
            $first: '$corrector.url',
          },
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          _id: 0,
          userPreview: {
            id: '$_id',
            login: '$login',
            imgUrl: '$imgUrl',
          },
          value: '$value',
        },
      },
    ]);
  }

  /* Personal Evaluation Page */

  async averageFinalMark(@Args('uid') uid: number): Promise<number> {
    const [averageFinalMark] = await this.scaleTeamModel.aggregate<{
      result: number;
    }>([
      {
        $match: {
          'corrector.id': uid,
          finalMark: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: 0,
          count: {
            $sum: 1,
          },
          sum: {
            $sum: '$finalMark',
          },
        },
      },
      {
        $project: {
          result: {
            $round: [
              {
                $divide: ['$sum', '$count'],
              },
              2,
            ],
          },
        },
      },
    ]);
    return averageFinalMark?.result ?? 0;
  }

  async personalAverageFeedbackLength(
    @Args('uid') uid: number,
  ): Promise<number> {
    const [averageFeedbackLength] = await this.scaleTeamModel.aggregate<{
      result: number;
    }>([
      {
        $match: {
          $or: [{ 'correcteds.id': uid }, { 'corrector.id': uid }],
        },
      },
      {
        $group: {
          _id: 'result',
          len: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$corrector.id', uid],
                },
                then: {
                  $strLenCP: {
                    $ifNull: ['$comment', ''],
                  },
                },
                else: {
                  $strLenCP: {
                    $ifNull: ['$feedback', ''],
                  },
                },
              },
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          result: {
            $round: [
              {
                $divide: ['$len', '$count'],
              },
              2,
            ],
          },
        },
      },
    ]);
    return averageFeedbackLength?.result ?? 0;
  }

  async currMonthCnt(@Args('uid') uid: number): Promise<number> {
    const currDate = Util.Time.currDate();
    const startOfMonth = Util.Time.startOfMonth(currDate);
    const [currMonthCnt] = await this.scaleTeamModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          'corrector.id': uid,
          beginAt: {
            $gte: new Date(startOfMonth),
          },
        },
      },
      {
        $count: 'count',
      },
    ]);
    return currMonthCnt?.count ?? 0;
  }

  async lastMonthCnt(@Args('uid') uid: number): Promise<number> {
    const currDate = Util.Time.currDate();
    const startOfMonth = Util.Time.startOfMonth(currDate);
    const startOfLastMonth = Util.Time.startOfLastMonth(currDate);
    const [lastMonthCnt] = await this.scaleTeamModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          'corrector.id': uid,
          beginAt: {
            $gte: new Date(startOfLastMonth),
            $lt: new Date(startOfMonth),
          },
        },
      },
      {
        $count: 'count',
      },
    ]);
    return lastMonthCnt?.count ?? 0;
  }

  /**
   * @description 유저가 평가자일때의 평균 평가 시간을 분단위로 반환합니다.
   */
  async averageDuration(@Args('uid') uid: number): Promise<number> {
    const [averageDuration] = await this.scaleTeamModel.aggregate<{
      sumOfDuration: number;
    }>([
      {
        $match: {
          'corrector.id': uid,
        },
      },
      {
        $group: {
          _id: null,
          sumOfDuration: {
            $sum: {
              $cond: {
                if: { $ne: ['$filledAt', null] },
                then: { $subtract: ['$filledAt', '$beginAt'] },
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sumOfDuration: 1,
        },
      },
    ]);
    return Math.floor((averageDuration?.sumOfDuration ?? 0) / 1000 / 60);
  }

  async evalInfos(@Args() args: GetEvalInfoArgs): Promise<PersonalScaleTeam[]> {
    const matchPipline = () => {
      switch (args.evalUserType) {
        case EvalUserEnum.ANY:
          return ScaleTeamsPipeline.evalInfo.any(args);
        case EvalUserEnum.CORRECTOR:
          return ScaleTeamsPipeline.evalInfo.corrector(args);
        case EvalUserEnum.CORRECTED:
          return ScaleTeamsPipeline.evalInfo.corrected(args);
      }
    };

    const evalInfos = await this.scaleTeamModel.aggregate([
      matchPipline(),
      {
        $match: {
          $expr: {
            $cond: {
              if: {
                $eq: [args.outstandingOnly, true],
              },
              then: {
                $eq: ['$flag.id', 9],
              },
              else: {},
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          corrector: {
            id: '$corrector.id',
            login: '$corrector.login',
            imgUrl: '$corrector.url',
            comment: '$comment',
            correctorRate: {
              $ifNull: [
                {
                  $arrayElemAt: ['$feedbacks.rating', 0],
                },
                0,
              ],
            },
          },
          feedback: '$feedback',
          beginAt: 1,
          finalMark: 1,
          flag: {
            id: '$flag.id',
            name: '$flag.name',
            isPositive: '$flag.positive',
          },
          projectPreview: {
            id: '$team.projectId',
          },
          teamPreview: {
            id: '$team.id',
            name: '$team.name',
            url: '$team.url',
          },
        },
      },
      {
        $limit: 5, //: page
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectPreview.id',
          foreignField: 'id',
          as: 'projectPreview',
        },
      },
      {
        $addFields: {
          projectPreview: {
            $first: '$projectPreview',
          },
        },
      },
    ]);

    return evalInfos ?? [];
  }

  /* Total Page */

  async totalEvalCnt(): Promise<number> {
    const [totalEvalCnt] = await this.scaleTeamModel.aggregate<{
      count: number;
    }>([
      {
        $count: 'count',
      },
    ]);
    return totalEvalCnt?.count ?? 0;
  }

  async averageFeedbackLength(): Promise<number> {
    const [averageFeedbackLength] = await this.scaleTeamModel.aggregate<{
      result: number;
    }>([
      {
        $match: {
          feedback: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          totalFeedbackLength: {
            $sum: { $strLenCP: { $ifNull: ['$feedback', ''] } },
          },
          evalCnt: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          result: {
            $floor: { $divide: ['$totalFeedbackLength', '$evalCnt'] },
          },
        },
      },
    ]);
    return averageFeedbackLength?.result ?? 0;
  }

  /* Personal General Page */

  async personalTotalEvalCnt(@Args('uid') uid: number): Promise<number> {
    const [personalTotalEvalCnt] = await this.scaleTeamModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          'corrector.id': uid,
        },
      },
      {
        $count: 'count',
      },
    ]);
    return personalTotalEvalCnt?.count ?? 0;
  }
}
