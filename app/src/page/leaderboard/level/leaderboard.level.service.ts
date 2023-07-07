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
import type { RankingArgs, RankingByDateTemplateFn } from '../leaderboard.type';
import type { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';

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

  rankingByDateTemplate: RankingByDateTemplateFn<cursus_user> = async (
    dateTemplate,
    rankingArgs,
  ) => {
    const cachedRanking = await this.cursusUserCacheService.getUserRanking(
      USER_LEVEL_RANKING,
    );

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);
    const rankingTotal = await this.ranking({ cachedRanking, ...rankingArgs });

    return this.dateRangeService.toDateRanged(rankingTotal, dateRange);
  };
}
