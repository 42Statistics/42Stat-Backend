import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type GetRankArgs,
  type GetRankingArgs,
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
    cacheArgs: Omit<GetRankArgs, 'dateTemplate'>,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRawRank({
      dateTemplate: DateTemplate.TOTAL,
      ...cacheArgs,
    });
  }

  async getUserRanking(
    cacheArgs: Omit<GetRankingArgs, 'dateTemplate'>,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRawRanking({
      dateTemplate: DateTemplate.TOTAL,
      ...cacheArgs,
    });
  }
}
