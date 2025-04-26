import type { FilterQuery } from 'mongoose';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { cursus_user } from './cursusUser.database.schema';

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
      grade: 'Cadet',
    };
  }

  return {
    blackholedAt: { $lt: now },
    grade: 'Cadet',
  };
};

export const aliveUserFilter: FilterQuery<cursus_user> = {
  $or: [
    { blackholedAt: { $gte: new Date() } },
    { grade: 'Transcender' },
    { grade: 'Alumni' },
  ],
};
