import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { coalitions_user } from './coalitionsUser.database.schema';

export type ScoreInfo = {
  coalitionId: number;
  userId: number;
  scores: number;
};

/**
 *
 * @description
 * coalitions user 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    coalitions_users: coalitions_user[]
 * }
 * ```
 *
 * @see coalitions_user
 */
export const lookupCoalitionsUser: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('coalitions_users', localField, foreignField, pipeline);
