import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model } from 'mongoose';
import { UserRanking } from 'src/common/models/common.user.model';
import { UserScoreRank } from 'src/page/personalGeneral/models/personal.general.userProfile.model';
import { Time } from 'src/util';
import { ScoreInfo } from './db/coalitionsUser.database.aggregate';
import { coalitions_user } from './db/coalitionsUser.database.schema';

@Injectable()
export class CoalitionsUserService {
  constructor(
    @InjectModel(coalitions_user.name)
    private coalitionsUserModel: Model<coalitions_user>,
  ) {}

  scoreInfo(
    start: Date = Time.startOfMonth(Time.curr()), //todo: 기본 기간 설정
    end: Date = Time.startOfMonth(Time.moveMonth(Time.curr(), 1)),
    limit?: number,
  ): Aggregate<any> {
    //todo: aggregate type
    const aggregate = this.coalitionsUserModel.aggregate();

    aggregate
      .lookup({
        from: 'cursus_users',
        localField: 'userId',
        foreignField: 'user.id',
        as: 'cursus_users',
      })
      .match({
        $or: [
          { 'cursus_users.blackholedAt': null },
          {
            'cursus_users.blackholedAt': {
              $gte: Time.curr(),
            },
          },
        ],
      })
      .lookup({
        from: 'scores',
        localField: 'id',
        foreignField: 'coalitionsUserId',
        as: 'scores',
        pipeline: [
          {
            $match: {
              createdAt: { $gte: start, $lt: end },
            },
          },
        ],
      })
      .project({
        userId: 1,
        coalitionId: 1,
        scores: {
          $sum: '$scores.value',
        },
      })
      .sort({ scores: -1 });

    if (limit) {
      aggregate.limit(limit);
    }

    return aggregate;
  }

  async scoreRank(
    start: Date,
    end: Date,
    limit: number = Number.MAX_SAFE_INTEGER,
  ): Promise<UserRanking[]> {
    const aggregate = this.scoreInfo(start, end, limit);

    return await aggregate
      .lookup({
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'user',
      })
      .project({
        _id: 0,
        userPreview: {
          id: '$userId',
          login: { $first: '$user.login' },
          imgUrl: { $first: '$user.image.link' },
        },
        value: '$scores',
      });
  }

  async scoreRankById(
    uid: number,
    start: Date,
    end: Date,
  ): Promise<UserScoreRank> {
    const rankInTotalArr: ScoreInfo[] = await this.scoreInfo(start, end);

    const userRanking = rankInTotalArr.find(
      (rankInTotal: ScoreInfo) => rankInTotal.userId === uid,
    );
    const coalitionId = userRanking?.coalitionId;
    const value = userRanking?.scores;

    const rankInCoalitionArr: ScoreInfo[] = rankInTotalArr.filter(
      (rankInTotal: ScoreInfo) => rankInTotal.coalitionId === coalitionId,
    );

    const findTotalRankById = (rankInTotalArr: ScoreInfo) =>
      rankInTotalArr.userId === uid;
    const findCoalitionRankById = (rankInCoalitionArr: ScoreInfo) =>
      rankInCoalitionArr.userId === uid;

    const rankInCoalition =
      rankInCoalitionArr.findIndex(findCoalitionRankById) + 1;
    const rankInTotal = rankInTotalArr.findIndex(findTotalRankById) + 1;

    if (value === undefined) {
      throw new NotFoundException();
    }

    return {
      value,
      rankInCoalition,
      rankInTotal,
    };
  }
}
