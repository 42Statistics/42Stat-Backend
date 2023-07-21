import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type {
  CursusUserDocument,
  cursus_user,
} from 'src/api/cursusUser/db/cursusUser.database.schema';
import {
  LeaderboardUtilService,
  type RankingByDateTemplateFn,
} from '../util/leaderboard.util.service';

@Injectable()
export class LeaderboardLevelService {
  constructor(
    private readonly leaderboardUtilService: LeaderboardUtilService,
    private readonly cursusUserService: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
  ) {}

  rankingByDateTemplate: RankingByDateTemplateFn<cursus_user> = async (
    dateTemplate,
    rankingArgs,
  ) => {
    return await this.leaderboardUtilService.rankingByDateTemplateImpl(
      dateTemplate,
      rankingArgs,
      () => this.cursusUserCacheService.getUserRanking(USER_LEVEL_RANKING),
      (filter?: FilterQuery<cursus_user>) =>
        this.cursusUserService.ranking(
          { sort: { level: -1 }, ...filter },
          (doc: CursusUserDocument) => doc.level,
        ),
    );
  };
}
