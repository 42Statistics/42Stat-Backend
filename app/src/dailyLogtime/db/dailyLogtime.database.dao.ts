import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import type {
  UserLogtimeRecordByDateRangeOutput,
  UserLogtimeRecordsByDateRangeInput,
} from '../dailyLogtime.dto';
import { daily_logtimes } from './dailyLogtime.database.schema';

export type DailyLogtimeDao = {
  userLogtimeRecordsByDateRange: (
    args: UserLogtimeRecordsByDateRangeInput,
  ) => Promise<UserLogtimeRecordByDateRangeOutput[]>;
};

@Injectable()
export class DailyLogtimeDaoImpl implements DailyLogtimeDao {
  constructor(
    @InjectModel(daily_logtimes.name)
    private readonly dailyLogtime: Model<daily_logtimes>,
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
  ) {}

  async userLogtimeRecordsByDateRange({
    userId,
    start,
    end,
  }: UserLogtimeRecordsByDateRangeInput): Promise<
    UserLogtimeRecordByDateRangeOutput[]
  > {
    return await this.dailyLogtime
      .aggregate<UserLogtimeRecordByDateRangeOutput>()
      .match({
        userId,
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .group({
        _id: {
          $dateToString: {
            date: '$date',
            format: '%Y-%m',
            timezone: this.runtimeConfig.TIMEZONE,
          },
        },
        value: { $sum: '$value' },
      })
      .sort({ _id: 1 })
      .project({
        _id: 0,
        yearMonth: '$_id',
        value: 1,
      });
  }
}
