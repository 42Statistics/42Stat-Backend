import type { PipelineStage } from 'mongoose';
import {
  lookupStage,
  type CollectionLookup,
} from 'src/database/mongoose/database.mongoose.aggregation';
// eslint-disable-next-line

/**
 *
 * @description
 * users 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    users: user[]
 * }
 * ```
 *
 * @see user
 */
export const lookupUser: CollectionLookup = (
  localField,
  foreignField,
  pipeine,
) => lookupStage('users', localField, foreignField, pipeine);

/**
 *
 * @description
 * users field 에서 ```UserPreview``` 를 추가합니다.
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
