import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';
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
export const lookupTitle: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
): ReturnType<typeof lookupStage> =>
  lookupStage('titles', localField, foreignField, pipeline);
