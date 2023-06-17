import { Injectable } from '@nestjs/common';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type {
  CursusUserDocument,
  cursus_user,
} from 'src/api/cursusUser/db/cursusUser.database.schema';
import { findUserRank } from 'src/common/findUserRank';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import type { RankingArgs } from '../leaderboard.ranking.args';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private leaderboardUtilService: LeaderboardUtilService,
    private cursusUserService: CursusUserService,
    private cursusUserCacheService: CursusUserCacheService,
    private dateRangeService: DateRangeService,
  ) {}

  async ranking({
    userId,
    paginationIndexArgs,
    filter,
    cachedRanking,
  }: RankingArgs<cursus_user>): Promise<LeaderboardElement> {
    const levelRanking =
      cachedRanking ??
      (await this.cursusUserService.ranking(
        { sort: { level: -1 }, filter },
        (doc: CursusUserDocument) => doc.level,
      ));

    const me = findUserRank(levelRanking, userId);

    return this.leaderboardUtilService.toLeaderboardElement(
      me,
      levelRanking,
      paginationIndexArgs,
    );
  }

  async rankingTotal(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    const cachedRanking = await this.cursusUserCacheService.getUserRanking(
      USER_LEVEL_RANKING,
    );

    return await this.ranking({ userId, paginationIndexArgs, cachedRanking });
  }

  async rankingByDateTemplate(
    userId: number,
    paginationIndexArgs: PaginationIndexArgs,
    dateTemplate: DateTemplate.TOTAL,
  ): Promise<LeaderboardElementDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    const rankingTotal = await this.rankingTotal(userId, paginationIndexArgs);

    return this.dateRangeService.toDateRanged(rankingTotal, dateRange);
  }
}
