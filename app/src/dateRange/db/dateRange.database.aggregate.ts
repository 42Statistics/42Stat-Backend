import type { DateRangeArgs } from '../dtos/dateRange.dto';

export const dateRangeFilter = ({
  start,
  end,
}: DateRangeArgs): { $gte: Date; $lt: Date } => ({
  $gte: start,
  $lt: end,
});
