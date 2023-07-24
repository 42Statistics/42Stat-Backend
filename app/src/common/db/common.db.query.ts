import type { FilterQuery, Model, SortValues } from 'mongoose';

export type QueryArgs<T> = Partial<{
  filter: FilterQuery<T>;
  select: string | Array<string> | Record<string, any>;
  sort: Record<string, SortValues>;
  limit: number;
  skip: number;
}>;

export type QueryOneArgs<T> = Omit<QueryArgs<T>, 'limit'>;

export const findOne =
  <Schema>(queryOneArgs?: QueryOneArgs<Schema>) =>
  (model: Model<Schema>) => {
    const query = model.findOne(queryOneArgs?.filter ?? {});

    if (queryOneArgs?.sort) {
      query.sort(queryOneArgs.sort);
    }

    if (queryOneArgs?.skip) {
      query.skip(queryOneArgs.skip);
    }

    if (queryOneArgs?.select) {
      query.select(queryOneArgs.select);
    }

    return query;
  };

export const findAll =
  <Schema>(queryArgs?: QueryArgs<Schema>) =>
  (model: Model<Schema>) => {
    const query = model.find(queryArgs?.filter ?? {});

    if (queryArgs?.sort) {
      query.sort(queryArgs.sort);
    }

    if (queryArgs?.skip) {
      query.skip(queryArgs.skip);
    }

    if (queryArgs?.limit) {
      query.limit(queryArgs.limit);
    }

    if (queryArgs?.select) {
      query.select(queryArgs.select);
    }

    return query;
  };
