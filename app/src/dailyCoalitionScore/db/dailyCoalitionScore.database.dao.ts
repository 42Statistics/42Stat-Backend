import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { mv_daily_score_values } from './dailyCoalitionScore.database.schema';
import type {
  FindScorePerCoalitionByDateInput,
  FindScorePerCoalitionByDateOutput,
} from '../dailyCoalitionScore.dto';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import type { ConfigType } from '@nestjs/config';
import { lookupCoalition } from 'src/api/coalition/db/coalition.database.aggregate';
import { coalition } from 'src/api/coalition/db/coalition.database.schema';

export type DailyCoalitionScoreDao = {
  findScoresPerCoalitionByDate: (
    args: FindScorePerCoalitionByDateInput,
  ) => Promise<FindScorePerCoalitionByDateOutput[]>;
};

@Injectable()
export class DailyCoalitionScoreDaoImpl implements DailyCoalitionScoreDao {
  constructor(
    @InjectModel(mv_daily_score_values.name)
    private readonly dailyCoalitionScore: Model<mv_daily_score_values>,
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
  ) {}

  async findScoresPerCoalitionByDate({
    start,
    end,
  }: FindScorePerCoalitionByDateInput): Promise<
    FindScorePerCoalitionByDateOutput[]
  > {
    return await this.dailyCoalitionScore
      .aggregate<FindScorePerCoalitionByDateOutput>()
      .match({
        date: {
          $gte: start,
          $lt: end,
        },
      })
      .group({
        _id: {
          date: {
            $dateFromParts: {
              year: {
                $year: {
                  date: '$date',
                  timezone: this.runtimeConfig.TIMEZONE,
                },
              },
              month: {
                $month: {
                  date: '$date',
                  timezone: this.runtimeConfig.TIMEZONE,
                },
              },
              timezone: this.runtimeConfig.TIMEZONE,
            },
          },
          coalitionId: '$coalitionId',
        },
        value: {
          $sum: '$value',
        },
      })
      .sort({
        '_id.date': 1,
        '_id.coalitionId': 1,
      })
      .group({
        _id: '$_id.coalitionId',
        scores: {
          $push: {
            date: '$_id.date',
            value: '$value',
          },
        },
      })
      .append(lookupCoalition('_id', 'id'))
      .sort({ _id: 1 })
      .project({
        _id: 0,
        coalition: {
          $first: `$${coalition.name}s`,
        },
        scores: 1,
      });
  }
}
