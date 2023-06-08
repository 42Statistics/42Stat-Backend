import { PipelineStage } from 'mongoose';
import type { IntRecord } from '../models/common.valueRecord.model';

export type AggrNumeric = { value: number };
export type AggrRecord = { records: IntRecord[] };

export type AggrNumericPerDate = { date: string } & AggrNumeric;
export type AggrNumericPerCluster = { cluster: string } & AggrNumeric;

export type AggrDatePartition = {
  $dateToString: {
    date: Date;
    format: string;
  };
};

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
