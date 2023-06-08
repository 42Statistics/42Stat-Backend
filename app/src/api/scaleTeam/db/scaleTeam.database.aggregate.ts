import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { scale_team } from './scaleTeam.database.schema';

/**
 *
 * @description
 * scale_teams 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    scale_teams: scale_team[]
 * }
 * ```
 *
 * @see scale_team
 */
export const lookupScaleTeams: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('scale_teams', localField, foreignField, pipeline);
