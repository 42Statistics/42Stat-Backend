import { Injectable } from '@nestjs/common';
import {
  ScaleTeamCacheService,
  type EvalCountRankingSupportedDateTemplate,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { assertExist } from 'src/common/assertExist';
import type { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  async rankingByDateTemplate(
    rankingArgs: RankingByDateTemplateArgs<EvalCountRankingSupportedDateTemplate>,
  ): Promise<LeaderboardElementDateRanged> {
    const rank = await this.scaleTeamCacheService.getEvalCountRank(rankingArgs);

    const ranking = await this.scaleTeamCacheService.getEvalCountRanking(
      rankingArgs,
    );

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs: rankingArgs.paginationIndexArgs,
      dateTemplate: rankingArgs.dateTemplate,
    });
  }
}
