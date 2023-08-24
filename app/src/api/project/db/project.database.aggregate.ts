import {
  CollectionLookup,
  lookupStage,
} from 'src/database/mongoose/database.mongoose.aggregation';
// eslint-disable-next-line
import type { project } from './project.database.schema';
import { NETWHAT_PREVIEW, PROJECT_BASE_URL } from 'src/config/api';

export const conditionalProjectPreview = (
  projectIdField: string,
  projectField: string,
) => ({
  $cond: {
    if: { $eq: [`$${projectIdField}`, NETWHAT_PREVIEW.id] },
    then: NETWHAT_PREVIEW,
    else: {
      id: `$${projectField}.id`,
      name: `$${projectField}.name`,
      circle: `$${projectField}.circle`,
      url: {
        $concat: [PROJECT_BASE_URL, '/', { $toString: `$${projectField}.id` }],
      },
    },
  },
});

export const concatProjectUrl = (projectIdField: string) => ({
  $concat: [PROJECT_BASE_URL, '/', { $toString: `$${projectIdField}` }],
});

// todo: projectsUserId 가 배열이 아닌 경우
export const concatProjectUserUrl = (
  projectIdField: string,
  projectUserIdField: string,
) => ({
  $concat: [
    PROJECT_BASE_URL,
    '/',
    { $toString: `$${projectIdField}` },
    '/projects_users/',
    {
      $toString: {
        $first: `$${projectUserIdField}`,
      },
    },
  ],
});

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
