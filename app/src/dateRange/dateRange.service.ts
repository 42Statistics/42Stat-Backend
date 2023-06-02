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
    //todo: defalut: 06-04~06-11 -> 06-04~06-05(today)변경해야할때 확인하기
    case DateTemplate.CURRWEEK:
      return {
        start: Time.startOfWeek(curr),
        end: Time.moveWeek(Time.startOfWeek(curr), 1),
      };
    case DateTemplate.LASTWEEK:
      return {
        start: Time.moveWeek(Time.startOfWeek(curr), -1),
        end: Time.startOfWeek(curr),
      };
    case DateTemplate.CURRMONTH:
      return {
        start: Time.startOfMonth(curr),
        end: Time.moveMonth(Time.startOfMonth(curr), 1),
      };
    case DateTemplate.LASTMONTH:
      return {
        start: Time.moveMonth(Time.startOfMonth(curr), -1),
        end: Time.startOfMonth(curr),
      };
    /**
     * curr = 23-05-18
     * lastYear = 22-06-01 ~ 23-06-01
     */
    case DateTemplate.LASTYEAR:
      const nextMonth = Time.startOfMonth(Time.moveMonth(curr, 1));
      const lastYear = Time.moveYear(nextMonth, -1);
      return {
        start: lastYear,
        end: nextMonth,
      };
  }
};
