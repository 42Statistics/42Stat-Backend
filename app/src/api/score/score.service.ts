import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { addRank } from 'src/common/db/common.db.aggregation';
import type { UserRankWithCoalitionId } from 'src/common/models/common.user.model';
import type {
  IntPerCoalition,
  ScoreRecordPerCoalition,
} from 'src/page/home/coalition/models/home.coalition.model';
import { CoalitionService } from '../coalition/coalition.service';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { addUserPreview } from '../cursusUser/db/cursusUser.database.aggregate';
import { lookupScores } from './db/score.database.aggregate';
import { score } from './db/score.database.schema';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(score.name)
    private scoreModel: Model<score>,
    private coalitionService: CoalitionService,
    private cursusUserService: CursusUserService,
  ) {}

  async scoreRanking(
    filter?: FilterQuery<score>,
  ): Promise<UserRankWithCoalitionId[]> {
    const aggregate =
      this.cursusUserService.aggregate<UserRankWithCoalitionId>();

    return await aggregate
      .append(lookupCoalitionsUser('user.id', 'userId'))
      .addFields({ coalitions_users: { $first: '$coalitions_users' } })
      .append(
        lookupScores(
          'coalitions_users.id',
          'coalitionsUserId',
          filter ? [{ $match: filter }] : undefined,
        ),
      )
      .addFields({
        value: {
          $sum: '$scores.value',
        },
      })
      .append(addRank())
      .append(addUserPreview('user'))
      .project({
        _id: 0,
        userPreview: 1,
        coalitionId: '$coalitions_users.coalitionId',
        value: 1,
        rank: 1,
      });
  }

  async scoresPerCoalition(): Promise<IntPerCoalition[]> {
    const aggregate = this.scoreModel.aggregate<IntPerCoalition>();

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

  async scoreRecordsPerCoalition(
    filter?: FilterQuery<score>,
  ): Promise<ScoreRecordPerCoalition[]> {
    const aggregate = this.scoreModel.aggregate<ScoreRecordPerCoalition>();

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
            at: {
              $dateFromString: {
                dateString: '$_id.at',
                timezone: process.env.TZ,
              },
            },
            value: '$value',
          },
        },
      })
      .sort({ _id: 1 })
      .append(lookupCoalition('_id', 'id'))
      .project({ _id: 0, coalition: { $first: '$coalitions' }, records: 1 });
  }

  async tigCountPerCoalition(
    targetCoalitionId: readonly number[],
    filter?: FilterQuery<score>,
  ): Promise<IntPerCoalition[]> {
    const aggregate = this.coalitionService.aggregate<IntPerCoalition>();

    return await aggregate
      .match({ id: { $in: targetCoalitionId } })
      .addFields({
        coalition: '$$ROOT',
      })
      .append(
        lookupScores('id', 'coalitionId', [
          {
            $match: {
              ...filter,
              coalitionsUserId: { $ne: null },
              value: { $lt: 0 },
            },
          },
        ]),
      )
      .project({
        _id: 0,
        coalition: 1,
        value: { $size: '$scores' },
      });
  }
}
