import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserRanking } from 'src/common/models/common.user.model';
import {
  CoalitionScore,
  CoalitionScoreRecords,
} from './db/score.database.aggregate';
import { score } from './db/score.database.schema';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(score.name)
    private scoreModel: Model<score>,
  ) {}

  // async find(
  //   filter: FilterQuery<score> = {},
  //   pageSize: number,
  //   pageNumber: number,
  // ): Promise<score[]> {
  //   if (pageSize < 1 || pageNumber < 1) {
  //     throw new InternalServerErrorException();
  //   }

  //   return await this.scoreModel
  //     .find(filter)
  //     .sort({ createdAt: -1 })
  //     .limit(pageSize)
  //     .skip(pageNumber);
  // }

  async getScoresByCoalition(): Promise<CoalitionScore[]> {
    const aggregate = this.scoreModel.aggregate<CoalitionScore>();

    return await aggregate
      .match({ coalitionsUserId: { $ne: null } })
      .group({ _id: '$coalitionId', value: { $sum: '$value' } })
      // todo: 이거 해야하나?
      .project({ _id: 0, coalitionId: '$_id', value: 1 })
      .sort({ coalitionId: 1 });
  }

  async getScoreRecords(
    start: Date,
    end: Date,
    coalitionIds: number[],
  ): Promise<CoalitionScoreRecords[]> {
    if (coalitionIds.length === 0) {
      return [];
    }

    const aggregate = this.scoreModel.aggregate<CoalitionScoreRecords>();

    return await aggregate
      .match({
        createdAt: { $gte: start, $lt: end },
        coalitionsUserId: { $ne: null },
        coalitionId: { $in: coalitionIds },
      })
      .group({
        _id: {
          coalitionId: '$coalitionId',
          at: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
              timezone: process.env.TZ,
            },
          },
        },
        value: { $sum: '$value' },
      })
      .sort({ '_id.at': 1 })
      .group({
        _id: '$_id.coalitionId',
        records: {
          $push: {
            at: { $dateFromString: { dateString: '$_id.at' } },
            value: '$value',
          },
        },
      })
      .project({ _id: 0, coalitionId: '$_id', records: 1 })
      .sort({ coalitionId: 1 });
  }

  async getScoreRanks(
    start: Date,
    end: Date,
    limit: number,
  ): Promise<UserRanking[]> {
    const aggregate = this.scoreModel.aggregate<UserRanking>();

    return await aggregate
      .match({ createdAt: { $gte: start, $lt: end } })
      .group({ _id: '$coalitionsUserId', value: { $sum: '$value' } })
      .sort({ value: -1 })
      .limit(limit)
      .lookup({
        from: 'coalitions_users',
        localField: '_id',
        foreignField: 'id',
        as: 'coalitionsUser',
      })
      .lookup({
        from: 'users',
        localField: 'coalitionsUser.userId',
        foreignField: 'id',
        as: 'user',
      })
      .project({
        _id: 0,
        userPreview: {
          id: '$user.id',
          login: '$user.login',
          imgUrl: '$user.image.link',
        },
        value: 1,
      });
  }
}
