import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import { addRank } from 'src/database/mongoose/database.mongoose.aggregation';
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
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
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
          { $match: { coalitionId: { $in: targetCoalitionIds } } },
        ]),
      )
      .append(
        lookupScores('coalitions_users.id', 'coalitionsUserId', [
          {
            $match: {
              ...args?.filter,
              coalitionsUserId: { $ne: null },
            },
          },
        ]),
      )
      .addFields({ value: { $sum: '$scores.value' } })
      .append(addRank())
      .append(addUserPreview('user'))
      .project({
        _id: 0,
        userPreview: 1,
        coalition: { id: { $first: '$coalitions_users.coalitionId' } },
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
      .group({
        _id: '$coalitionId',
        value: { $sum: '$value' },
      })
      .append(lookupCoalition('_id', 'id'))
      .sort({ _id: 1 })
      .project({
        _id: 0,
        coalition: { $first: '$coalitions' },
        value: 1,
      });
  }

  async scoreRecordsPerCoalition(args?: {
    targetCoalitionIds?: readonly number[];
    filter?: FilterQuery<score>;
  }): Promise<ScoreRecordPerCoalition[]> {
    const targetCoalitionIds =
      args?.targetCoalitionIds ?? this.coalitionService.getSeoulCoalitionIds();

    const aggregate =
      this.coalitionService.aggregate<ScoreRecordPerCoalition>();

    return await aggregate
      .match({
        id: { $in: targetCoalitionIds },
      })
      .sort({ id: 1 })
      .addFields({ coalition: '$$ROOT' })
      .append(
        lookupScores('id', 'coalitionId', [
          {
            $match: {
              ...args?.filter,
              coalitionsUserId: { $ne: null },
            },
          },
          {
            $group: {
              _id: {
                $dateFromParts: {
                  year: {
                    $year: {
                      date: '$createdAt',
                      timezone: this.runtimeConfig.TIMEZONE,
                    },
                  },
                  month: {
                    $month: {
                      date: '$createdAt',
                      timezone: this.runtimeConfig.TIMEZONE,
                    },
                  },
                  timezone: this.runtimeConfig.TIMEZONE,
                },
              },
              value: { $sum: '$value' },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]),
      )
      .project({
        _id: 0,
        coalition: 1,
        records: {
          $map: {
            input: '$scores',
            as: 'arr',
            in: {
              at: '$$arr._id',
              value: '$$arr.value',
            },
          },
        },
      });
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
      .addFields({ coalition: '$$ROOT' })
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

  async winCountPerCoalition(args?: {
    targetCoalitionIds?: readonly number[];
    filter?: FilterQuery<score>;
  }): Promise<IntPerCoalition[]> {
    const targetCoalitionIds =
      args?.targetCoalitionIds ?? this.coalitionService.getSeoulCoalitionIds();

    const aggregate = this.scoreModel.aggregate<IntPerCoalition>();

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
              timezone: this.runtimeConfig.TIMEZONE,
            },
          },
        },
        value: { $sum: '$value' },
      })
      .sort({
        at: 1,
        value: -1,
      })
      .group({
        _id: '$_id.at',
        winCoalition: { $first: '$$ROOT' },
      })
      .group({
        _id: '$winCoalition._id.coalitionId',
        value: { $count: {} },
      })
      .append(lookupCoalition('_id', 'id'))
      .project({
        _id: 0,
        coalition: { $first: '$coalitions' },
        value: 1,
      })
      .then((winCountPerCoalition) => {
        return winCountPerCoalition.sort(
          (a, b) => a.coalition.id - b.coalition.id,
        );
      });
  }
}
