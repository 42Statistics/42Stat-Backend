import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';

/**
 *
 * @description
 * project session skill 을 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    project_sessions_skills: project_sessions_skill[]
 * }
 * ```
 *
 * @see project_sessions_skill
 */
export const lookupProjectSessionsSkill: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
): ReturnType<typeof lookupStage> =>
  lookupStage('project_sessions_skills', localField, foreignField, pipeline);
