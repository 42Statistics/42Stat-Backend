import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type {
  FindEvalCountByDateInput,
  FindEvalCountByDateOutput,
  FindUserEvalCountByDateInput,
} from '../dailyEvalCount.dto';
import { mv_daily_user_scale_team_counts } from './dailyEvalCount.database.schema';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import type { ConfigType } from '@nestjs/config';

export type DailyEvalCountDao = {
  findEvalCountsByDate: (
    args: FindEvalCountByDateInput,
  ) => Promise<FindEvalCountByDateOutput[]>;
  findUserEvalCountsByDatePerMonth: (
    args: FindUserEvalCountByDateInput,
  ) => Promise<FindEvalCountByDateOutput[]>;
};

@Injectable()
export class DailyEvalCountDaoImpl implements DailyEvalCountDao {
  constructor(
    @InjectModel(mv_daily_user_scale_team_counts.name)
    private readonly dailyUserEvalCountModel: Model<mv_daily_user_scale_team_counts>,
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
  ) {}

  async findEvalCountsByDate({
    start,
    end,
  }: FindEvalCountByDateInput): Promise<FindEvalCountByDateOutput[]> {
    return await this.dailyUserEvalCountModel
      .aggregate<FindEvalCountByDateOutput>()
      .match({
        date: {
          $gte: start,
          $lt: end,
        },
      })
      .group({
        // timezone 달라지면 dateFromParts 등으로 변환할것
        _id: '$date',
        count: {
          $sum: '$count',
        },
      })
      .sort({ _id: 1 })
      .project({
        _id: 0,
        date: '$_id',
        count: 1,
      });
  }

  async findUserEvalCountsByDatePerMonth({
    userId,
    start,
    end,
  }: FindUserEvalCountByDateInput): Promise<FindEvalCountByDateOutput[]> {
    return await this.dailyUserEvalCountModel
      .aggregate<FindEvalCountByDateOutput>()
      .match({
        userId,
        date: {
          $gte: start,
          $lt: end,
        },
      })
      .group({
        _id: {
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
        count: {
          $sum: '$count',
        },
      })
      .sort({ _id: 1 })
      .project({
        _id: 0,
        date: '$_id',
        count: 1,
      });
  }
}
