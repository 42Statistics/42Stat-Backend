import { PipelineStage } from 'mongoose';
import type { ValueRecord } from 'src/page/home/models/home.model';

export type AggrNumeric = { value: number };
export type AggrRecord = { records: ValueRecord[] };

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
