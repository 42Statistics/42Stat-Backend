import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';

/**
 *
 * @description
 * project session 을 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    project_sessions: project_session[]
 * }
 * ```
 *
 * @see project_session
 */
export const lookupProjectSession: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
): ReturnType<typeof lookupStage> =>
  lookupStage('project_sessions', localField, foreignField, pipeline);
