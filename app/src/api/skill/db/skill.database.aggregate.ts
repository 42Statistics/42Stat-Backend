import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';

/**
 *
 * @description
 * skill 을 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    skills: skill[]
 * }
 * ```
 *
 * @see skill
 */
export const lookupSkill: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
): ReturnType<typeof lookupStage> =>
  lookupStage('skills', localField, foreignField, pipeline);
