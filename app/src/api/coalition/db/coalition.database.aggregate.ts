import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';
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
export const lookupCoalition: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
): ReturnType<typeof lookupStage> =>
  lookupStage('coalitions', localField, foreignField, pipeline);
