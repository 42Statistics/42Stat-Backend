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
  const curr = Time.curr();

  switch (dateTemplate) {
    case DateTemplate.CURR_WEEK:
      return {
        start: Time.startOfWeek(curr),
        end: Time.moveWeek(Time.startOfWeek(curr), 1),
      };
    case DateTemplate.LAST_WEEK:
      return {
        start: Time.moveWeek(Time.startOfWeek(curr), -1),
        end: Time.startOfWeek(curr),
      };
    case DateTemplate.CURR_MONTH:
      return {
        start: Time.startOfMonth(curr),
        end: Time.moveMonth(Time.startOfMonth(curr), 1),
      };
    case DateTemplate.LAST_MONTH:
      return {
        start: Time.moveMonth(Time.startOfMonth(curr), -1),
        end: Time.startOfMonth(curr),
      };
    case DateTemplate.LAST_YEAR:
      const nextMonth = Time.startOfMonth(Time.moveMonth(curr, 1));
      const lastYear = Time.moveYear(nextMonth, -1);
      return {
        start: lastYear,
        end: nextMonth,
      };
  }
};
