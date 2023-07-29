import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type RankCache,
} from 'src/cache/cache.util.ranking.service';
import {
  CacheUtilService,
  type UserFullProfileMap,
} from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CursusUserService } from './cursusUser.service';

export const USER_WALLET_RANKING = 'userWalletRanking';
export const USER_LEVEL_RANKING = 'userLevelRanking';
export const USER_CORRECTION_POINT_RANKING = 'userCorrectionPointRanking';

export type UserRankingKey =
  | typeof USER_WALLET_RANKING
  | typeof USER_LEVEL_RANKING
  | typeof USER_CORRECTION_POINT_RANKING;

export type UserFullProfileCache = Awaited<
  ReturnType<CursusUserService['findOneUserFullProfilebyUserId']>
>;

@Injectable()
export class CursusUserCacheService {
  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cacheUtilRankingService: CacheUtilRankingService,
  ) {}

  async getUserFullProfile(
    userId: number,
  ): Promise<UserFullProfileCache | undefined> {
    return this.cacheUtilService.getUserFullProfile(userId);
  }

  async getAllUserFullProfile(): Promise<UserFullProfileMap | undefined> {
    return await this.cacheUtilService.getUserFullProfileMap();
  }

  async getUserRank(
    keyBase: UserRankingKey,
    userId: number,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRawRank({
      keyBase,
      userId,
      dateTemplate: DateTemplate.TOTAL,
    });
  }

  async getUserRanking(
    keyBase: UserRankingKey,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRawRanking({
      keyBase,
      dateTemplate: DateTemplate.TOTAL,
    });
  }
}
