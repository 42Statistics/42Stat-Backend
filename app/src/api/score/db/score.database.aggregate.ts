import type { PipelineStage } from 'mongoose';
import { lookupStage } from 'src/common/db/common.db.aggregation';

export const lookupScores = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
) => lookupStage('scores', localField, foreignField, pipeline);
