import type { PipelineStage } from 'mongoose';
import type { coalition } from 'src/api/coalition/db/coalition.database.schema';
import { lookupStage } from 'src/common/db/common.db.aggregation';
import type { UserFullProfile } from '../cursusUser.service';
// eslint-disable-next-line
import type { cursus_user } from './cursusUser.database.schema';

export type UserFullProfileAggr = Omit<UserFullProfile, 'coalition'> & {
  coalition?: coalition;
};

/**
 *
 * @description
 * cursus_users 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    cursus_users: cursus_user[]
 * }
 * ```
 *
 * @see cursus_user
 */
export const lookupCursusUser = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
): ReturnType<typeof lookupStage> =>
  lookupStage('cursus_users', localField, foreignField, pipeline);

/**
 *
 * @description
 * cursus_users field 에서 ```UserPreview``` 를 추가합니다.
 *
 * @returns
 * ```ts
 * type DocType = {
 *    userPreview: {
 *      id: number;
 *      login: string;
 *      imgUrl: string;
 *    }
 * }
 * ```
 */
export const addUserPreview = (userField: string): PipelineStage => ({
  $addFields: {
    userPreview: {
      id: `$${userField}.id`,
      login: `$${userField}.login`,
      imgUrl: `$${userField}.image.link`,
    },
  },
});
