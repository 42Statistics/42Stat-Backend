import { Injectable } from '@nestjs/common';
import { expIncreamentDateFilter } from 'src/api/experienceUser/db/experiecneUser.database.aggregate';
import type { experience_user } from 'src/api/experienceUser/db/experienceUser.database.schema';
import {
  ExpIncreamentRankingCacheSupportedDateTemplate,
  ExperienceUserCacheService,
} from 'src/api/experienceUser/experienceUser.cache.service';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type {
  RankingByDateRangeFn,
  RankingByDateTemplateFn,
  RankingFn,
} from '../leaderboard.type';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardExpService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private experienceUserService: ExperienceUserService,
    private experienceUserCacheService: ExperienceUserCacheService,
    private dateRangeService: DateRangeService,
  ) {}

  ranking: RankingFn<experience_user> = async (rankingArgs) => {
    return await this.leaderboardUtilService.rankingImpl(
      this.experienceUserService.increamentRanking,
      rankingArgs,
    );
  };

  rankingByDateRange: RankingByDateRangeFn<experience_user> = async (
    dateRange,
    rankingArgs,
  ) => {
    const dateFilter = expIncreamentDateFilter(dateRange);

    const ranking = await this.ranking({
      filter: dateFilter,
      ...rankingArgs,
    });

    return this.dateRangeService.toDateRanged(ranking, dateRange);
  };

  rankingByDateTemplate: RankingByDateTemplateFn<
    experience_user,
    ExpIncreamentRankingCacheSupportedDateTemplate
  > = async (dateTemplate, rankingArgs) => {
    const cachedRanking =
      await this.experienceUserCacheService.getExpIncreamentRanking(
        dateTemplate,
      );

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.rankingByDateRange(dateRange, {
      cachedRanking,
      ...rankingArgs,
    });
  };
}
