import type { FilterQuery } from 'mongoose';
import type { location } from './location.database.schema';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export const locationDateRangeFilter = (
  dateRange: DateRange,
): FilterQuery<location> => ({
  beginAt: { $lt: dateRange.end },
  $or: [{ endAt: { $gte: dateRange.start } }, { endAt: null }],
});
