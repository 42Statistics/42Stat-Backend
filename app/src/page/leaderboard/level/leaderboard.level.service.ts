import { Injectable } from '@nestjs/common';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { LeaderboardElementDateRanged } from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly cursusUserCacheService: CursusUserCacheService,
  ) {}

  async rankingByDateTemplate({
    dateTemplate,
    userId,
    paginationIndexArgs,
    promo,
  }: RankingByDateTemplateArgs<DateTemplate.TOTAL>): Promise<LeaderboardElementDateRanged> {
    const rank = await this.cursusUserCacheService.getUserRank(
      USER_LEVEL_RANKING,
      userId,
      promo,
    );

    const ranking = await this.cursusUserCacheService.getUserRanking(
      USER_LEVEL_RANKING,
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
