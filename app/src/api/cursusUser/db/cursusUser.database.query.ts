import type { FilterQuery } from 'mongoose';
import { StatDate } from 'src/statDate/StatDate';
import type { cursus_user } from './cursusUser.database.schema';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export const blackholedUserFilterByDateRange = (
  dateRange?: DateRange,
): FilterQuery<cursus_user> => {
  const now = new StatDate();

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
  $or: [{ blackholedAt: { $gte: new StatDate() } }, { grade: 'Member' }],
};
