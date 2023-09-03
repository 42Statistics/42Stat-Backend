import type { FilterQuery } from 'mongoose';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { cursus_user } from './cursusUser.database.schema';

export const promo = (date: Date): number => {
  //| undefined => {
  const promoMap: Record<string, number> = {
    '2020-1': 1,
    '2020-5': 1,
    '2020-8': 2,
    '2020-11': 3,
    '2021-4': 4,
    '2021-10': 5,
    '2022-2': 6,
    '2022-6': 7,
    '2022-10': 8,
    '2023-2': 9,
    '2023-7': 10,
  };

  const beginAt = `${date.getFullYear()}-${date.getMonth()}`;

  return promoMap[beginAt]; // || undefined;
};

export const promoFilter = (date: Date): FilterQuery<cursus_user> => {
  const dateWrapper = new DateWrapper(date);

  return {
    beginAt: {
      $gte: dateWrapper.moveWeek(-1).toDate(),
      $lt: dateWrapper.moveWeek(1).toDate(),
    },
  };
};

export const blackholedUserFilterByDateRange = (
  dateRange?: DateRange,
): FilterQuery<cursus_user> => {
  const now = new Date();

  if (dateRange) {
    return {
      blackholedAt: {
        $gte: dateRange.start,
        $lt: dateRange.end < now ? dateRange.end : now,
      },
      grade: 'Learner',
    };
  }

  return {
    blackholedAt: { $lt: now },
    grade: 'Learner',
  };
};

export const aliveUserFilter: FilterQuery<cursus_user> = {
  $or: [{ blackholedAt: { $gte: new Date() } }, { grade: 'Member' }],
};
