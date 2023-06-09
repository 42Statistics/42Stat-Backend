import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { experience_user } from './experienceUser.database.schema';

/**
 *
 * @description
 * experience user 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    experience users: experience_user[]
 * }
 * ```
 *
 * @see experience_user
 */
export const lookupExperienceUsers: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('experience_users', localField, foreignField, pipeline);
