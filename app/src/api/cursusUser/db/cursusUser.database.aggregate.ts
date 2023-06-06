import type { PipelineStage } from 'mongoose';
import type { coalition } from 'src/api/coalition/db/coalition.database.schema';
import type { title } from 'src/api/title/db/title.database.schema';
import type { titles_user } from 'src/api/titlesUser/db/titlesUser.database.schema';
import { lookupStage } from 'src/common/db/common.db.aggregation';
import type { cursus_user } from './cursusUser.database.schema';

export type UserFullProfile = {
  cursusUser: cursus_user;
  coalition: coalition;
  titlesUsers: (titles_user & {
    titles: title;
  })[];
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
