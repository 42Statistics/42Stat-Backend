import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { addRank } from 'src/common/db/common.db.aggregation';
import type {
  IntPerCoalition,
  ScoreRecordPerCoalition,
} from 'src/page/home/coalition/models/home.coalition.model';
import { CoalitionService } from '../coalition/coalition.service';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import type { coalition } from '../coalition/db/coalition.database.schema';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { addUserPreview } from '../user/db/user.database.aggregate';
import {
  UserRankWithCoalitionId,
  lookupScores,
} from './db/score.database.aggregate';
import { score } from './db/score.database.schema';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(score.name)
    private readonly scoreModel: Model<score>,
    private readonly coalitionService: CoalitionService,
    private readonly cursusUserService: CursusUserService,
  ) {}

  async scoreRanking(args?: {
    targetCoalitionIds?: readonly number[];
    filter?: FilterQuery<score>;
  }): Promise<UserRankWithCoalitionId[]> {
    const targetCoalitionIds =
      args?.targetCoalitionIds ?? this.coalitionService.getSeoulCoalitionIds();

    const aggregate =
      this.cursusUserService.aggregate<UserRankWithCoalitionId>();

    return await aggregate
      .append(
        lookupCoalitionsUser('user.id', 'userId', [
          {
            $match: {
              coalitionId: { $in: targetCoalitionIds },
            },
          },
        ]),
      )
      .addFields({ coalitions_users: { $first: '$coalitions_users' } })
      .match({ coalitions_users: { $ne: null } })
      .append(
        lookupScores(
          'coalitions_users.id',
          'coalitionsUserId',
          args?.filter ? [{ $match: args.filter }] : undefined,
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
        coalition: {
          id: '$coalitions_users.coalitionId',
        },
        value: 1,
        rank: 1,
      });
  }

  async scoresPerCoalition(args?: {
    targetCoalitionIds?: readonly number[];
  }): Promise<IntPerCoalition[]> {
    const targetCoalitionIds =
      args?.targetCoalitionIds ?? this.coalitionService.getSeoulCoalitionIds();

    const aggregate = this.scoreModel.aggregate<IntPerCoalition>();

    return await aggregate
      .match({
        coalitionsUserId: { $ne: null },
        coalitionId: { $in: targetCoalitionIds },
      })
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

  async scoreRecordsPerCoalition(args?: {
    targetCoalitionIds?: readonly number[];
    filter?: FilterQuery<score>;
  }): Promise<ScoreRecordPerCoalition[]> {
    const targetCoalitionIds =
      args?.targetCoalitionIds ?? this.coalitionService.getSeoulCoalitionIds();

    const aggregate = this.scoreModel.aggregate<ScoreRecordPerCoalition>();

    // todo: 여기도 다른 record 처럼 통일하면 좋을 듯
    return await aggregate
      .match({
        ...args?.filter,
        coalitionsUserId: { $ne: null },
        coalitionId: { $in: targetCoalitionIds },
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

  async tigCountPerCoalition(args?: {
    targetCoalitionIds?: readonly number[];
    filter?: FilterQuery<score>;
  }): Promise<IntPerCoalition[]> {
    const targetCoalitionIds =
      args?.targetCoalitionIds ?? this.coalitionService.getSeoulCoalitionIds();

    const aggregate = this.coalitionService.aggregate<
      Omit<IntPerCoalition, 'coalition'> & { coalition: coalition }
    >();

    return await aggregate
      .match({ id: { $in: targetCoalitionIds } })
      .addFields({
        coalition: '$$ROOT',
      })
      .append(
        lookupScores('id', 'coalitionId', [
          {
            $match: {
              ...args?.filter,
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
      })
      .then((tigCountPerCoalition) =>
        tigCountPerCoalition.map((tigCountPerCurrCoalition) => ({
          ...tigCountPerCurrCoalition,
          coalition: this.coalitionService.daoToDto(
            tigCountPerCurrCoalition.coalition,
          ),
        })),
      );
  }
}
