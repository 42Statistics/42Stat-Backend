import { Injectable } from '@nestjs/common';
import { scoreDateRangeFilter } from 'src/api/score/db/score.database.aggregate';
import type { score } from 'src/api/score/db/score.database.schema';
import {
  ScoreCacheService,
  ScoreRankingSupportedDateTemplate,
} from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { RankCache } from 'src/cache/cache.util.service';
import { findUserRank } from 'src/common/findUserRank';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import type { RankingArgs } from '../leaderboard.type';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

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
  }: RankingArgs<score>): Promise<LeaderboardElement> {
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

  async rankingByDateRange(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateRange: DateRange,
    cachedRanking?: RankCache[],
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter = scoreDateRangeFilter(dateRange);

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
    dateTemplate: ScoreRankingSupportedDateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const cachedRanking = await this.scoreCacheService.getScoreRanking(
      dateTemplate,
    );

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.rankingByDateRange(
      userId,
      paginationIndexArgs,
      dateRange,
      cachedRanking,
    );
  }
}
