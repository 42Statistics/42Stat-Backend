import { Injectable } from '@nestjs/common';
import {
  ScoreCacheService,
  type ScoreRankingSupportedDateTemplate,
} from 'src/api/score/score.cache.service';
import { assertExist } from 'src/common/assertExist';
import type { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardScoreService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly scoreCacheService: ScoreCacheService,
  ) {}

  async rankingByDateTemplate(
    rankingArgs: RankingByDateTemplateArgs<ScoreRankingSupportedDateTemplate>,
  ): Promise<LeaderboardElementDateRanged> {
    const rank = await this.scoreCacheService.getScoreRank(rankingArgs);

    const ranking = await this.scoreCacheService.getScoreRanking(rankingArgs);

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs: rankingArgs.paginationIndexArgs,
      dateTemplate: rankingArgs.dateTemplate,
    });
  }
}
