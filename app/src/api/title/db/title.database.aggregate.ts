import { PipelineStage } from 'mongoose';
import { lookupStage } from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { title } from './title.database.schema';

/**
 *
 * @description
 * title 을 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    titles: title[]
 * }
 * ```
 *
 * @see title
 */
export const lookupTitle = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
): ReturnType<typeof lookupStage> =>
  lookupStage('titles', localField, foreignField, pipeline);
