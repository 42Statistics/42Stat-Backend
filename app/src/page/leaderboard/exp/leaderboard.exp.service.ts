import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { experience_user } from 'src/api/experienceUser/db/experienceUser.database.schema';
import { ExperienceUserCacheService } from 'src/api/experienceUser/experienceUser.cache.service';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
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

@Injectable()
export class LeaderboardExpService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private experienceUserService: ExperienceUserService,
    private experienceUserCacheService: ExperienceUserCacheService,
    private dateRangeService: DateRangeService,
  ) {}

  async ranking({
    userId,
    paginationIndexArgs,
    filter,
    cachedRanking,
  }: RankingArgs<experience_user>): Promise<LeaderboardElement> {
    const expRanking =
      cachedRanking ??
      (await this.experienceUserService.increamentRanking(filter));

    const me = findUserRank(expRanking, userId);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      expRanking,
      paginationIndexArgs,
    );
  }

  async rankingByDateRange(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateRange: DateRange,
    cachedRanking?: UserRank[],
  ): Promise<LeaderboardElementDateRanged> {
    const dateFilter: FilterQuery<experience_user> = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const expRanking = await this.ranking({
      userId,
      paginationIndexArgs,
      filter: dateFilter,
      cachedRanking,
    });

    return this.dateRangeService.toDateRanged(expRanking, dateRange);
  }

  async rankingByDateTemplate(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateTemplate: DateTemplate,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.rankingByDateRange(
      userId,
      paginationIndexArgs,
      dateRange,
      await this.experienceUserCacheService.getExpIncreamentRankingCacheByDateTemplate(
        dateTemplate,
      ),
    );
  }
}
