import type { PipelineStage } from 'mongoose';
import { lookupStage } from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { titles_user } from './titlesUser.database.schema';

/**
 *
 * @description
 * titles_user 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    titles_users: titles_user[]
 * }
 * ```
 *
 * @see titles_user
 */
export const lookupTitlesUser = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
): ReturnType<typeof lookupStage> =>
  lookupStage('titles_users', localField, foreignField, pipeline);
