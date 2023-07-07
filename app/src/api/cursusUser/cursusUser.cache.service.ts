import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type UserFullProfileMap,
  type UserRankCache,
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
  constructor(private cacheUtilService: CacheUtilService) {}

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
  ): Promise<UserRankCache | undefined> {
    return await this.cacheUtilService.getRank({
      keyBase,
      userId,
      dateTemplate: DateTemplate.TOTAL,
    });
  }

  async getUserRanking(
    keyBase: UserRankingKey,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheUtilService.getRanking({
      keyBase,
      dateTemplate: DateTemplate.TOTAL,
    });
  }
}
