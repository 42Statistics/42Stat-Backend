import { PipelineStage } from 'mongoose';
import type { IntRecord } from '../../common/models/common.valueRecord.model';

export type AggrNumeric = { value: number };
export type AggrRecord = { records: IntRecord[] };

export type AggrDateBucket = { at: Date | 'default' };
export type AggrNumericPerDateBucket = AggrDateBucket & AggrNumeric;
export type AggrNumericPerCluster = { cluster: string } & AggrNumeric;

export type CollectionLookup = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
) => ReturnType<typeof lookupStage>;

export function findByDateFromAggrDateBucket<T extends AggrDateBucket>(
  buckets: T[],
  date: Date,
): T | undefined;

export function findByDateFromAggrDateBucket<T extends AggrDateBucket>(
  buckets: T[],
  defaultString: string,
): T | undefined;

export function findByDateFromAggrDateBucket<T extends AggrDateBucket>(
  buckets: T[],
  dateOrString: Date | string,
) {
  if (typeof dateOrString === 'string') {
    return buckets.find((bucket) => bucket.at === dateOrString);
  }

  return buckets.find(
    (bucket) =>
      bucket.at instanceof Date &&
      bucket.at.getTime() === dateOrString.getTime(),
  );
}

export const lookupStage = (
  collection: string,
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
): PipelineStage.Lookup => {
  const lookupStage: PipelineStage.Lookup = {
    $lookup: {
      from: collection,
      localField,
      foreignField,
      as: collection,
    },
  };

  if (pipeline) {
    lookupStage.$lookup.pipeline = pipeline;
  }

  return lookupStage;
};

/**
 *
 * @description
 * value 로 정렬하여 rank 를 추가합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    rank: number;
 * };
 * ```
 */
export const addRank = (
  sortBy?: PipelineStage.SetWindowFields['$setWindowFields']['sortBy'],
): PipelineStage.SetWindowFields => ({
  $setWindowFields: {
    sortBy: sortBy ?? { value: -1 },
    output: {
      rank: { $rank: {} },
    },
  },
});
