import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { score } from 'src/api/score/db/score.database.schema';
import {
  SCORE_RANKING_TOTAL,
  ScoreCacheService,
} from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { findUserRank } from 'src/common/findUserRank';
import type { UserRankWithCoalitionId } from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRangeArgs, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import type { RankingArgs } from '../leaderboard.ranking.args';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

// 나중에 코알리숑별로 나눌때 활용할 여지가 있다고 생각하여 남겨둡니다
type ScoreRankingArgs = Omit<RankingArgs<score>, 'cachedRanking'> & {
  cachedRanking?: UserRankWithCoalitionId[];
};

@Injectable()
export class LeaderboardScoreService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private scoreService: ScoreService,
    private scoreCacheService: ScoreCacheService,
    private dateRangeService: DateRangeService,
  ) {}

  async ranking({
    userId,
    paginationIndexArgs,
    filter,
    cachedRanking,
  }: ScoreRankingArgs): Promise<LeaderboardElement> {
    const scoreRanking =
      cachedRanking ?? (await this.scoreService.scoreRanking(filter));

    const me = findUserRank(scoreRanking, userId);
    const totalRanks = scoreRanking.filter(({ value }) => value >= 0);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      totalRanks,
      paginationIndexArgs,
    );
  }

  async rankingTotal(userId: number, paginationIndexArgs: PaginationIndexArgs) {
    const cachedRanking = await this.scoreCacheService.getScoreRankingCache(
      SCORE_RANKING_TOTAL,
    );

    return await this.ranking({ userId, paginationIndexArgs, cachedRanking });
  }

  async rankingByDateRange(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateRange: DateRangeArgs,
    cachedRanking?: UserRankWithCoalitionId[],
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<score> = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const scoreRanking = await this.ranking({
      userId,
      paginationIndexArgs,
      filter: dateFilter,
      cachedRanking,
    });

    return this.dateRangeService.toDateRanged(scoreRanking, dateRange);
  }

  async rankingByDateTemplate(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateTemplate: Extract<
      DateTemplate,
      DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
    >,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    if (dateTemplate === DateTemplate.TOTAL) {
      const rankingTotal = await this.rankingTotal(userId, paginationIndexArgs);

      return this.dateRangeService.toDateRanged(rankingTotal, dateRange);
    }

    const cachedRanking =
      await this.scoreCacheService.getScoreRankingCacheByDateTemplate(
        dateTemplate,
      );

    return this.rankingByDateRange(
      userId,
      paginationIndexArgs,
      dateRange,
      cachedRanking,
    );
  }
}
