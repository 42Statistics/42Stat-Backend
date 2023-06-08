import type { FilterQuery, SortValues } from 'mongoose';

export type QueryArg<T> = Partial<{
  filter: FilterQuery<T>;
  sort: Record<string, SortValues>;
  limit: number;
}>;
