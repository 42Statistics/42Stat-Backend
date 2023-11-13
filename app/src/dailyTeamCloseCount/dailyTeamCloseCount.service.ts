import { Injectable } from '@nestjs/common';
import { DailyTeamCloseClountDaoImpl } from './db/dailyTeamCloseCount.database.dao';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class DailyTeamCloseCountService {
  constructor(
    private readonly dailyTeamCloseCountDao: DailyTeamCloseClountDaoImpl,
  ) {}

  async teamCloseCountRecords({ start, end }: DateRange): Promise<IntRecord[]> {
    const teamCloseCounts =
      await this.dailyTeamCloseCountDao.findTeamCloseCountsByDate({
        start,
        end,
      });

    return teamCloseCounts.map(({ date, count }) => ({
      at: date,
      value: count,
    }));
  }
}
