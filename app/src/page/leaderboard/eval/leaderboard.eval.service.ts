import { Injectable } from '@nestjs/common';
import { evalCountDateRangeFilter } from 'src/api/scaleTeam/db/scaleTeam.database.aggregate';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import {
  EvalCountRankingSupportedDateTemplate,
  ScaleTeamCacheService,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { findUserRank } from 'src/common/findUserRank';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type {
  RankingByDateRangeFn,
  RankingByDateTemplateFn,
  RankingFn,
} from '../leaderboard.type';
import type { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardEvalService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private scaleTeamService: ScaleTeamService,
    private scaleTeamCacheService: ScaleTeamCacheService,
    private dateRangeService: DateRangeService,
  ) {}

  ranking: RankingFn<scale_team> = async ({
    userId,
    paginationIndexArgs,
    filter,
    cachedRanking,
  }) => {
    const evalRanking =
      cachedRanking ?? (await this.scaleTeamService.evalCountRanking(filter));

    const me = findUserRank(evalRanking, userId);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      evalRanking,
      paginationIndexArgs,
    );
  };

  rankingByDateRange: RankingByDateRangeFn<scale_team> = async (
    dateRange,
    rankingArgs,
  ) => {
    const dateFilter = evalCountDateRangeFilter(dateRange);

    const evalRanking = await this.ranking({
      filter: dateFilter,
      ...rankingArgs,
    });

    return this.dateRangeService.toDateRanged(evalRanking, dateRange);
  };

  rankingByDateTemplate: RankingByDateTemplateFn<
    scale_team,
    EvalCountRankingSupportedDateTemplate
  > = async (
    dateTemplate,
    rankingArgs,
  ): Promise<LeaderboardElementDateRanged> => {
    const cachedRanking = await this.scaleTeamCacheService.getEvalCountRanking(
      dateTemplate,
    );

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.rankingByDateRange(dateRange, {
      cachedRanking,
      ...rankingArgs,
    });
  };
}
