import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { score } from 'src/api/score/db/score.database.schema';
import {
  ScoreCacheService,
  type ScoreRankingSupportedDateTemplate,
} from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import type { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import {
  LeaderboardUtilService,
  type RankingByDateTemplateFn,
} from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardScoreService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly scoreService: ScoreService,
    private readonly scoreCacheService: ScoreCacheService,
  ) {}

  rankingByDateTemplate: RankingByDateTemplateFn<
    score,
    ScoreRankingSupportedDateTemplate
  > = async (
    dateTemplate: ScoreRankingSupportedDateTemplate,
    rankingArgs,
  ): Promise<LeaderboardElementDateRanged> => {
    return await this.leaderboardUtilService.rankingByDateTemplateImpl(
      dateTemplate,
      rankingArgs,
      () => this.scoreCacheService.getScoreRanking(dateTemplate),
      (filter?: FilterQuery<score>) =>
        this.scoreService.scoreRanking({ filter }),
    );
  };
}
