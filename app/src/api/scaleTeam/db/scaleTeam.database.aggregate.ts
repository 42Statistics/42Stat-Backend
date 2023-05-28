import type { PipelineStage } from 'mongoose';
// eslint-disable-next-line
import type { scale_team } from './scaleTeam.database.schema';

/**
 *
 * @description
 * scale_teams 를 lookup 합니다.
 *
 * @returns
 * ```ts
 * type DocType = {
 *    scale_teams: scale_team[]
 * }
 * ```
 *
 * @see scale_team
 */
export const lookupScaleTeams = (
  localField: string,
  foreignField: string,
  pipeline?: PipelineStage.Lookup['$lookup']['pipeline'],
): PipelineStage => {
  const lookupStage: PipelineStage.Lookup = {
    $lookup: {
      from: 'scale_teams',
      localField,
      foreignField,
      as: 'scale_teams',
    },
  };

  if (pipeline) {
    lookupStage.$lookup.pipeline = pipeline;
  }

  return lookupStage;
};

/**
 *
 * @description
 * 평가자 id 로 묶은 다음, 평가 횟수로 정렬하여 반환합니다.
 *
 * @returns
 * ```ts
 * type DocType = {
 *    _id: number;
 *    login: string;
 *    value: number;
 *    rank: number;
 * };
 * ```
 */
export const rankEvalCount: PipelineStage[] = [
  {
    $setWindowFields: {
      sortBy: { value: -1 },
      output: {
        rank: { $rank: {} },
      },
    },
  },
];
