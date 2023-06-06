import { Injectable } from '@nestjs/common';
import { StatDate } from 'src/statDate/StatDate';
import { DateRangeArgs, DateTemplate } from './dtos/dateRange.dto';
import type { IDateRangedType } from './models/dateRange.model';

@Injectable()
export class DateRangeService {
  toDateRanged<T>(data: T, { start, end }: DateRangeArgs): IDateRangedType<T> {
    return {
      data,
      start,
      end,
    };
  }

  dateRangeFromTemplate(dateTemplate: DateTemplate): DateRangeArgs {
    const now = new StatDate();

    switch (dateTemplate) {
      case DateTemplate.CURR_WEEK:
        return {
          start: now.startOfWeek(),
          end: now.startOfWeek().moveWeek(1),
        };
      case DateTemplate.LAST_WEEK:
        return {
          start: now.startOfWeek().moveWeek(-1),
          end: now.startOfWeek(),
        };
      case DateTemplate.CURR_MONTH:
        return {
          start: now.startOfMonth(),
          end: now.startOfMonth().moveMonth(1),
        };
      case DateTemplate.LAST_MONTH:
        return {
          start: now.startOfMonth().moveMonth(-1),
          end: now.startOfMonth(),
        };
      case DateTemplate.LAST_YEAR:
        const nextMonth = now.moveMonth(1).startOfMonth();
        const lastYear = nextMonth.moveYear(-1);

        return {
          start: lastYear,
          end: nextMonth,
        };
    }
  }

  aggrFilterFromDateRange({ start, end }: DateRangeArgs): {
    $gte: Date;
    $lt: Date;
  } {
    return {
      $gte: start,
      $lt: end,
    };
  }
}
