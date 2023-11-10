import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type {
  DailyActivity,
  DailyActivityDetailRecordUnion,
} from 'src/page/personal/general/models/personal.general.dailyActivity.model';
import {
  DailyActivityType,
  type DailyDefaultRecord,
  type DailyLogtimeDetailRecord,
  type DailyLogtimeRecord,
  type FindDailyActivityDetailRecordOutput,
} from './dailyActivity.dto';
import { DailyActivityDaoImpl } from './db/dailyActivity.database.dao';

@Injectable()
export class DailyActivityService {
  constructor(private readonly dailyActivityDao: DailyActivityDaoImpl) {}

  async userDailyActivityByDate(
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

  async userDailyActivityDetailRecordsById(
    userId: number,
    args: {
      type: Exclude<DailyActivityType, DailyActivityType.LOGTIME>;
      id: number;
    }[],
  ): Promise<(typeof DailyActivityDetailRecordUnion)[]> {
    const records = await this.dailyActivityDao.findAllDetailRecordByDate({
      userId,
      idsWithType: args,
    });

    return records.sort((a, b) => {
      const aEndAt = getDetailRecordEndAt(a);
      const bEndAt = getDetailRecordEndAt(b);

      return aEndAt.getTime() - bEndAt.getTime();
    });
  }
}

const isDailyLogtimeRecord = (
  record: DailyLogtimeRecord | DailyDefaultRecord,
): record is DailyLogtimeRecord => record.type === DailyActivityType.LOGTIME;

const getDetailRecordEndAt = (
  dailyActivityDetailRecord: Exclude<
    FindDailyActivityDetailRecordOutput,
    DailyLogtimeDetailRecord
  >,
): Date => {
  switch (dailyActivityDetailRecord.type) {
    case DailyActivityType.EVENT:
      return dailyActivityDetailRecord.endAt;
    case DailyActivityType.CORRECTED:
    case DailyActivityType.CORRECTOR:
      return dailyActivityDetailRecord.filledAt;
    default:
      throw new InternalServerErrorException('wrong getDetailRecordEndAt');
  }
};
