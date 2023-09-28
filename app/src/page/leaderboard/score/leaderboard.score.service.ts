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

  async rankingByDateTemplate({
    dateTemplate,
    userId,
    paginationIndexArgs,
    promo,
  }: RankingByDateTemplateArgs<ScoreRankingSupportedDateTemplate>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.scoreCacheService.getScoreRank(
      dateTemplate,
      userId,
      promo,
    );

    const ranking = await this.scoreCacheService.getScoreRanking(
      dateTemplate,
      promo,
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
