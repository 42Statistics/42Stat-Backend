import { Injectable } from '@nestjs/common';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { DailyActivity } from 'src/page/personal/general/models/personal.general.dailyActivity.model';
import { DailyActivityDaoImpl } from './db/dailyActivity.database.dao';
import {
  DailyActivityType,
  type DailyDefaultRecord,
  type DailyLogtimeRecord,
} from './dailyActivity.dto';

@Injectable()
export class DailyActivityService {
  constructor(private readonly dailyActivityDao: DailyActivityDaoImpl) {}

  async findAllUserDailyActivityByDate(
    userId: number,
    { start, end }: DateRange,
  ): Promise<DailyActivity[]> {
    const records = await this.dailyActivityDao.findAllRecordByDate({
      userId,
      start,
      end,
    });

    const recordMapByDate = records.reduce((recordMap, record) => {
      if (isDailyLogtimeRecord(record)) {
        const timestamp = record.date.getTime();
        const prevRecords = recordMap.get(timestamp) ?? [];

        recordMap.set(timestamp, [
          ...prevRecords,
          { type: record.type, value: record.value },
        ]);

        return recordMap;
      }

      const timestamp = new DateWrapper(record.at)
        .startOfDate()
        .toDate()
        .getTime();

      const prevRecords = recordMap.get(timestamp) ?? [];

      recordMap.set(timestamp, [...prevRecords, record]);

      return recordMap;
    }, new Map<number, DailyActivity['records']>());

    return Array.from(recordMapByDate.entries())
      .sort(([a], [b]) => a - b)
      .map(([timestamp, records]) => ({
        date: new Date(timestamp),
        records,
      }));
  }
}

const isDailyLogtimeRecord = (
  record: DailyLogtimeRecord | DailyDefaultRecord,
): record is DailyLogtimeRecord => record.type === DailyActivityType.LOGTIME;
