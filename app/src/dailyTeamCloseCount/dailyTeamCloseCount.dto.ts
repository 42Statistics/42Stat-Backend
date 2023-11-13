import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export type FindTeamCloseCountByDateInput = DateRange;

export type FindTeamCloseCountByDateOutput = {
  date: Date;
  count: number;
};
