import type { FilterQuery } from 'mongoose';
import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';
import type { scale_team } from './scaleTeam.database.schema';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';

export const evalCountDateRangeFilter = ({
  start,
  end,
}: DateRange): FilterQuery<scale_team> => ({
  beginAt: { $gte: start, $lt: end },
});

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
