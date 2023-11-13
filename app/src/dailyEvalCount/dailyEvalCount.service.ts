import { Injectable } from '@nestjs/common';
import { DailyEvalCountDaoImpl } from './db/dailyEvalCount.database.dao';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';

@Injectable()
export class DailyEvalCountService {
  constructor(private readonly dailyEvalCountDao: DailyEvalCountDaoImpl) {}

  async evalCountRecordsByDate({
    start,
    end,
  }: DateRange): Promise<IntRecord[]> {
    const evalCounts = await this.dailyEvalCountDao.findEvalCountsByDate({
      start,
      end,
    });

    return evalCounts.map(({ date, count }) => ({ at: date, value: count }));
  }

  async userEvalCountRecordsByDatePerMonth(
    userId: number,
    { start, end }: DateRange,
  ): Promise<IntRecord[]> {
    const userEvalCounts =
      await this.dailyEvalCountDao.findUserEvalCountsByDatePerMonth({
        userId,
        start,
        end,
      });

    return userEvalCounts.map(({ date, count }) => ({
      at: date,
      value: count,
    }));
  }
}
