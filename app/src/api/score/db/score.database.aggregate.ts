import type { FilterQuery } from 'mongoose';
import { SEOUL_COALITION_ID } from 'src/api/coalition/coalition.service';
import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';
import type { UserRank } from 'src/common/models/common.user.model';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import type { score } from './score.database.schema';

export type UserRankWithCoalitionId = UserRank & { coalition: { id: number } };

export const scoreDateRangeFilter = ({
  start,
  end,
}: DateRange): FilterQuery<score> => ({
  createdAt: { $gte: start, $lt: end },
});

export const scoreRecordsFilter = (dateRange: DateRange) => ({
  createdAt: scoreDateRangeFilter(dateRange),
  coalitionsUserId: { $ne: null },
  coalitionId: { $in: SEOUL_COALITION_ID },
});

/**
 *
 * @description
 * scores 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    scores: score[]
 * }
 * ```
 *
 * @see scale_team
 */
export const lookupScores: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('scores', localField, foreignField, pipeline);
