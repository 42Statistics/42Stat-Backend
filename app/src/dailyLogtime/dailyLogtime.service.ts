import { Injectable } from '@nestjs/common';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DailyLogtimeDaoImpl } from './db/dailyLogtime.database.dao';

@Injectable()
export class DailyLogtimeService {
  constructor(private readonly dailyLogtimeDao: DailyLogtimeDaoImpl) {}

  async userLogtimeRecordsByDateRange(
    userId: number,
    { start, end }: DateRange,
  ): Promise<IntRecord[]> {
    const userLogtimeRecords =
      await this.dailyLogtimeDao.userLogtimeRecordsByDateRange({
        userId,
        start,
        end,
      });

    return userLogtimeRecords.map(({ yearMonth, value }) => {
      const [year, month] = yearMonth.split('-').map(Number);

      return {
        at: new Date(year, month - 1),
        value,
      };
    });
  }
}
