import { IDateRangedType } from './models/dateRange.model';

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
