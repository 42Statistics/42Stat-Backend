import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import {
  ScaleTeamCacheService,
  type EvalCountRankingSupportedDateTemplate,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import {
  LeaderboardUtilService,
  type RankingByDateTemplateFn,
} from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private scaleTeamService: ScaleTeamService,
    private scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  rankingByDateTemplate: RankingByDateTemplateFn<
    scale_team,
    EvalCountRankingSupportedDateTemplate
  > = async (dateTemplate, rankingArgs) => {
    return await this.leaderboardUtilService.rankingByDateTemplateImpl(
      dateTemplate,
      rankingArgs,
      () => this.scaleTeamCacheService.getEvalCountRanking(dateTemplate),
      (filter?: FilterQuery<scale_team>) =>
        this.scaleTeamService.evalCountRanking(filter),
    );
  };
}
