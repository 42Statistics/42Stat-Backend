import { PipelineStage } from 'mongoose';
import { lookupStage } from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { coalition } from './coalition.database.schema';

/**
 *
 * @description
 * coalition 을 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    coalitions: coalition[]
 * }
 * ```
 *
 * @see coalition
 */
export const lookupCoalition = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
): ReturnType<typeof lookupStage> =>
  lookupStage('coalitions', localField, foreignField, pipeline);
