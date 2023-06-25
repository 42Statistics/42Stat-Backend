import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';
import type { experience_user } from './experienceUser.database.schema';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import type { FilterQuery } from 'mongoose';

export const expIncreamentDateFilter = ({
  start,
  end,
}: DateRange): FilterQuery<experience_user> => ({
  createdAt: { $gte: start, $lt: end },
});

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
