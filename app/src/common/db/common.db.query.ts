import type {
  FilterQuery,
  Model,
  QueryOptions,
  SortValues,
  UpdateQuery,
} from 'mongoose';

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

export const findOneAndLean =
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

    return query.lean();
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

export const findAllAndLean =
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

    return query.lean();
  };

export type UpdateQueryArgs<T> = Partial<{
  filter: FilterQuery<T>;
  update: UpdateQuery<T>;
  options: QueryOptions<T>;
}>;

/**
 *
 * @returns 새로 갱신 된 `Document`
 */
export const findOneAndUpdate =
  <Schema>(queryArgs?: UpdateQueryArgs<Schema>) =>
  (model: Model<Schema>) => {
    const defaultOptions: QueryOptions<Schema> = { new: true };

    const options = {
      ...defaultOptions,
      ...queryArgs?.options,
    };

    const query = model.findOneAndUpdate(
      queryArgs?.filter,
      queryArgs?.update,
      options,
    );

    return query;
  };

/**
 *
 * @returns 새로 갱신 된 `Schema`
 */
export const findOneAndUpdateAndLean =
  <Schema>(queryArgs?: UpdateQueryArgs<Schema>) =>
  (model: Model<Schema>) => {
    const defaultOptions: QueryOptions<Schema> = { new: true };

    const options = {
      ...defaultOptions,
      ...queryArgs?.options,
    };

    const query = model.findOneAndUpdate(
      queryArgs?.filter,
      queryArgs?.update,
      options,
    );

    return query.lean();
  };
