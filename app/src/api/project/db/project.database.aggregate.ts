import {
  CollectionLookup,
  lookupStage,
} from 'src/common/db/common.db.aggregation';
// eslint-disable-next-line
import type { project } from './project.database.schema';

/**
 *
 * @description
 * projects 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type AddType = {
 *    projects: project[]
 * }
 * ```
 *
 * @see project
 */
export const lookupProjects: CollectionLookup = (
  localField,
  foreignField,
  pipeline,
) => lookupStage('projects', localField, foreignField, pipeline);
