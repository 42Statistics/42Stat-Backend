import { Injectable } from '@nestjs/common';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { DateRange, DateRangeArgs, DateTemplate } from './dtos/dateRange.dto';
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

  // todo: lambda updated at
  dateRangeFromTemplate(dateTemplate: DateTemplate): DateRangeArgs {
    const now = new DateWrapper();

    switch (dateTemplate) {
      case DateTemplate.CURR_WEEK:
        return {
          start: now.startOfWeek().toDate(),
          end: now.startOfWeek().moveWeek(1).toDate(),
        };
      case DateTemplate.LAST_WEEK:
        return {
          start: now.startOfWeek().moveWeek(-1).toDate(),
          end: now.startOfWeek().toDate(),
        };
      case DateTemplate.CURR_MONTH:
        return {
          start: now.startOfMonth().toDate(),
          end: now.startOfMonth().moveMonth(1).toDate(),
        };
      case DateTemplate.LAST_MONTH:
        return {
          start: now.startOfMonth().moveMonth(-1).toDate(),
          end: now.startOfMonth().toDate(),
        };
      case DateTemplate.TOTAL:
        return {
          start: new Date(0),
          end: now.toDate(),
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

  getAbsoluteDateRangeByYear(year: number): DateRange {
    const start = DateWrapper.createByYear(year).startOfYear().toDate();
    const end = DateWrapper.createByYear(year)
      .startOfYear()
      .moveYear(1)
      .toDate();

    return { start, end };
  }

  getRelativeDateRange(): DateRange {
    const start = new DateWrapper().startOfDate().moveDate(-364).toDate();
    const end = new DateWrapper().startOfDate().moveDate(1).toDate();

    return { start, end };
  }
}
