import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { findUserRank } from 'src/common/findUserRank';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import type { RankingArgs } from '../leaderboard.ranking.args';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import {
  EVAL_COUNT_RANK_MONTHLY,
  EVAL_COUNT_RANK_TOTAL,
  EVAL_COUNT_RANK_WEEKLY,
  EvalCountRankCacheKey,
  LeaderboardEvalCacheService,
} from './leaderboard.eval.cache.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private leaderboardEvalCacheService: LeaderboardEvalCacheService,
    private leaderboardUtilService: LeaderboardUtilService,
    private scaleTeamService: ScaleTeamService,
    private dateRangeService: DateRangeService,
  ) {}

  async ranking({
    userId,
    paginationIndexArgs,
    filter,
    cachedRanking,
  }: RankingArgs<scale_team>): Promise<LeaderboardElement> {
    const evalRanking =
      cachedRanking ?? (await this.scaleTeamService.evalCountRanking(filter));

    const me = findUserRank(evalRanking, userId);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      evalRanking,
      paginationIndexArgs,
    );
  }

  async rankingTotal(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    const cachedRanking =
      await this.leaderboardEvalCacheService.getEvalCountRankCache(
        EVAL_COUNT_RANK_TOTAL,
      );

    return await this.ranking({ userId, paginationIndexArgs, cachedRanking });
  }

  async rankingByDateRange(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateRange: DateRange,
    cachedRanking?: UserRank[],
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const evalRanking = await this.ranking({
      userId,
      paginationIndexArgs,
      filter: dateFilter,
      cachedRanking,
    });

    return this.dateRangeService.toDateRanged(evalRanking, dateRange);
  }

  async rankingByDateTemplate(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);
    const cacheKey = selectCacheKeyByDateTemplate(dateTemplate);

    return this.rankingByDateRange(
      userId,
      paginationIndexArgs,
      dateRange,
      cacheKey
        ? await this.leaderboardEvalCacheService.getEvalCountRankCache(cacheKey)
        : undefined,
    );
  }
}

const selectCacheKeyByDateTemplate = (
  dateTemplate: DateTemplate,
): EvalCountRankCacheKey | undefined => {
  switch (dateTemplate) {
    case DateTemplate.CURR_MONTH:
      return EVAL_COUNT_RANK_MONTHLY;
    case DateTemplate.CURR_WEEK:
      return EVAL_COUNT_RANK_WEEKLY;
    default:
      return undefined;
  }
};
