import type { PipelineStage } from 'mongoose';
// eslint-disable-next-line
import type { cursus_user } from './cursusUser.database.schema';

/**
 *
 * @description
 * cursus_users 를 lookup 합니다.
 * ```foreignField``` 를 제공하지 않으면 ```user.id``` 를 통해 lookup 합니다.
 *
 * @returns
 * ```ts
 * type DocType = {
 *    cursus_users: cursus_user[]
 * }
 * ```
 *
 * @see cursus_user
 */
export const lookupCursusUser = (
  localField: string,
  foreignField = 'user.id',
): PipelineStage => ({
  $lookup: {
    from: 'cursus_users',
    localField,
    foreignField,
    as: 'cursus_users',
  },
});

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
