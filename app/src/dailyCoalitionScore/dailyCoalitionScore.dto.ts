import type { coalition } from 'src/api/coalition/db/coalition.database.schema';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export type FindScorePerCoalitionByDateInput = DateRange;

export type FindScorePerCoalitionByDateOutput = {
  coalition: coalition;
  scores: {
    date: Date;
    value: number;
  }[];
};
