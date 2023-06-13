import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type {
  CursusUserDocument,
  cursus_user,
} from 'src/api/cursusUser/db/cursusUser.database.schema';
import { findUserRank } from 'src/common/findUserRank';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import type { RankingArgs } from '../leaderboard.ranking.args';
import type { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import {
  LEVEL_RANK_TOTAL,
  LeaderboardLevelCacheService,
} from './leaderboard.level.cache.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private leaderboardLevelCacheService: LeaderboardLevelCacheService,
    private leaderboardUtilService: LeaderboardUtilService,
    private cursusUserService: CursusUserService,
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
    const cachedRanking =
      await this.leaderboardLevelCacheService.getLevelRankCache(
        LEVEL_RANK_TOTAL,
      );

    return await this.ranking({ userId, paginationIndexArgs, cachedRanking });
  }
}
