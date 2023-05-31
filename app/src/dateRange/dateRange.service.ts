import { Time } from 'src/util';
import { DateRangeArgs, DateTemplate } from './dtos/dateRange.dto';
import type { IDateRangedType } from './models/dateRange.model';

export const generateDateRanged = <T>(
  data: T,
  from: Date,
  to: Date,
): IDateRangedType<T> => {
  return {
    data,
    from,
    to,
  } as const;
};

export const dateRangeFromTemplate = (
  dateTemplate: DateTemplate,
): DateRangeArgs => {
  const curr = Time.curr();

  switch (dateTemplate) {
    case DateTemplate.WEEKLY:
      return {
        start: Time.startOfWeek(curr),
        end: Time.moveWeek(Time.startOfWeek(curr), 1),
      };
    case DateTemplate.MONTHLY:
      return {
        start: Time.startOfMonth(curr),
        end: Time.moveMonth(Time.startOfMonth(curr), 1),
      };
  }
};
