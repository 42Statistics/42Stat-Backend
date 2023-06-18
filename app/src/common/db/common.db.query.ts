import type { FilterQuery, SortValues } from 'mongoose';

export type QueryArgs<T> = Partial<{
  filter: FilterQuery<T>;
  select: string | Array<string> | Record<string, any>;
  sort: Record<string, SortValues>;
  limit: number;
  skip: number;
}>;
