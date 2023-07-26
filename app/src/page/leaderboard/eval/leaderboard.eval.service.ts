import { Injectable } from '@nestjs/common';
import {
  ScaleTeamCacheService,
  type EvalCountRankingSupportedDateTemplate,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { assertExist } from 'src/common/assertExist';
import type { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import {
  LeaderboardUtilService,
  type RankingByDateTemplateArgs,
} from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  async rankingByDateTemplate({
    dateTemplate,
    userId,
    paginationIndexArgs,
  }: RankingByDateTemplateArgs<EvalCountRankingSupportedDateTemplate>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.scaleTeamCacheService.getEvalCountRank(
      dateTemplate,
      userId,
    );

    const ranking = await this.scaleTeamCacheService.getEvalCountRanking(
      dateTemplate,
    );
    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs,
      dateTemplate,
    });
  }
}
