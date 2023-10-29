import { Injectable } from '@nestjs/common';
import {
  AverageReviewLengthRankingSupportedDateTemplate,
  ScaleTeamCacheService,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { assertExist } from 'src/common/assertExist';
import { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardCommentService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  async rankingByDateTemplate({
    dateTemplate,
    userId,
    paginationIndexArgs,
    promo,
    coalitionId,
  }: RankingByDateTemplateArgs<AverageReviewLengthRankingSupportedDateTemplate>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.scaleTeamCacheService.getCommentRank({
      dateTemplate,
      userId,
      promo,
      coalitionId,
    });

    const ranking = await this.scaleTeamCacheService.getCommentRanking({
      dateTemplate,
      promo,
      coalitionId,
    });

    assertExist(ranking);

    return this.leaderboardUtilService.toLeaderboardElementDateRanged({
      rank,
      ranking,
      paginationIndexArgs,
      dateTemplate,
    });
  }
}
