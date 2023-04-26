import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { UserRanking } from 'src/common/models/common.user.model';
import { score } from './db/score.database.schema';
import {
  CoalitionScore,
  CoalitionScoreRecords,
} from './models/score.coalition.model';

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
      .lookup({
        from: 'coalitions',
        localField: '_id',
        foreignField: 'id',
        as: 'coalition',
      })
      .sort({ _id: 1 })
      .project({ _id: 0, coalition: { $first: '$coalition' }, value: 1 });
  }

  async getScoreRecords(
    filter?: FilterQuery<score>,
  ): Promise<CoalitionScoreRecords[]> {
    const aggregate = this.scoreModel.aggregate<CoalitionScoreRecords>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
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
      .sort({ coalitionId: 1 })
      .lookup({
        from: 'coalitions',
        localField: '_id',
        foreignField: 'id',
        as: 'coalition',
      })
      .project({ _id: 0, coalition: { $first: '$coalition' }, records: 1 });
  }

  async getScoreRanks(
    limit: number,
    filter?: FilterQuery<score>,
  ): Promise<UserRanking[]> {
    const aggregate = this.scoreModel.aggregate<UserRanking>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
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
          id: { $first: '$user.id' },
          login: { $first: '$user.login' },
          imgUrl: { $first: '$user.image.link' },
        },
        value: 1,
      });
  }
}
