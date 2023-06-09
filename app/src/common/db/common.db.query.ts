import type { FilterQuery, SortValues } from 'mongoose';

export type QueryArgs<T> = Partial<{
  filter: FilterQuery<T>;
  sort: Record<string, SortValues>;
  limit: number;
}>;
