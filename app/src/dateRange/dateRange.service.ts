import { Time } from 'src/util';
import { DateRangeArgs, DateTemplate } from './dtos/dateRange.dto';
import type { IDateRangedType } from './models/dateRange.model';

export const generateDateRanged = <T>(
  data: T,
  { start, end }: DateRangeArgs,
): IDateRangedType<T> => {
  return {
    data,
    from: start, //todo: change name
    to: end,
  } as const;
};

export const dateRangeFromTemplate = (
  dateTemplate: DateTemplate,
): DateRangeArgs => {
  const now = Time.now();

  switch (dateTemplate) {
    case DateTemplate.CURR_WEEK:
      return {
        start: Time.startOfWeek(now),
        end: Time.moveWeek(Time.startOfWeek(now), 1),
      };
    case DateTemplate.LAST_WEEK:
      return {
        start: Time.moveWeek(Time.startOfWeek(now), -1),
        end: Time.startOfWeek(now),
      };
    case DateTemplate.CURR_MONTH:
      return {
        start: Time.startOfMonth(now),
        end: Time.moveMonth(Time.startOfMonth(now), 1),
      };
    case DateTemplate.LAST_MONTH:
      return {
        start: Time.moveMonth(Time.startOfMonth(now), -1),
        end: Time.startOfMonth(now),
      };
    case DateTemplate.LAST_YEAR:
      const nextMonth = Time.startOfMonth(Time.moveMonth(now, 1));
      const lastYear = Time.moveYear(nextMonth, -1);
      return {
        start: lastYear,
        end: nextMonth,
      };
  }
};
