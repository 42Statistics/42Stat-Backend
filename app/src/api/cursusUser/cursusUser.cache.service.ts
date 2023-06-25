import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { UserRankCache } from 'src/cache/cache.service';
import { CacheService } from 'src/cache/cache.service';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CursusUserService } from './cursusUser.service';
import type { UserFullProfile } from './db/cursusUser.database.aggregate';

export const USER_WALLET_RANKING = 'userWalletRanking';
export const USER_LEVEL_RANKING = 'userLevelRanking';
export const USER_CORRECTION_POINT_RANKING = 'userCorrectionPointRanking';

export type UserRankingKey =
  | typeof USER_WALLET_RANKING
  | typeof USER_LEVEL_RANKING
  | typeof USER_CORRECTION_POINT_RANKING;

export const USER_FULL_PROFILE = 'userFullProfile';
type UserFullProfileCache = Awaited<
  ReturnType<CursusUserService['findOneUserFullProfilebyUserId']>
>;

@Injectable()
export class CursusUserCacheService {
  constructor(
    private cursusUserService: CursusUserService,
    private cacheService: CacheService,
  ) {}

  async getUserFullProfile(
    userId: number,
  ): Promise<UserFullProfileCache | undefined> {
    const cached = await this.cacheService.hGet<UserFullProfileCache>(
      USER_FULL_PROFILE,
      userId.toString(),
    );

    if (!cached) {
      return undefined;
    }

    return cached;
  }

  async getAllUserFullProfile(): Promise<
    Map<string, UserFullProfileCache> | undefined
  > {
    const cached = await this.cacheService.hGetAll<UserFullProfileCache>(
      USER_FULL_PROFILE,
    );

    if (!cached) {
      return undefined;
    }

    return cached;
  }

  async getUserRank(
    key: UserRankingKey,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheService.getRank(key, DateTemplate.TOTAL, userId);
  }

  async getUserRanking(
    key: UserRankingKey,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheService.getRanking(key, DateTemplate.TOTAL);
  }

  // todo: 빈도 조절
  // @Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_30_SECONDS)
  // eslint-disable-next-line
  private async updateCursusUser(): Promise<void> {
    console.debug('enter cursusUserCache at', new Date().toLocaleString());

    try {
      await this.updateUserFullProfile();
    } catch (e) {
      console.error('userFullProfileCache', e);
    }

    console.debug('leaving cursusUserCache at', new Date().toLocaleString());
  }

  private async updateUserFullProfile(): Promise<void> {
    const userFullProfiles = await this.cursusUserService.userFullProfile();

    const walletRanking = toUserRanking(
      userFullProfiles,
      (a, b) => b.cursusUser.user.wallet - a.cursusUser.user.wallet,
      (userFullProfile) => userFullProfile.cursusUser.user.wallet,
    );

    const levelRanking = toUserRanking(
      userFullProfiles,
      (a, b) => b.cursusUser.level - a.cursusUser.level,
      (userFullProfile) => userFullProfile.cursusUser.level,
    );

    await Promise.all([
      this.cacheService.hSetMany(
        USER_FULL_PROFILE,
        userFullProfiles.map((profile) => ({
          field: profile.cursusUser.user.id.toString(),
          value: profile,
        })),
      ),
      this.cacheService.updateRanking(
        USER_WALLET_RANKING,
        DateTemplate.TOTAL,
        (_) => Promise.resolve(walletRanking),
        () => Promise.resolve(userFullProfiles),
      ),
      this.cacheService.updateRanking(
        USER_LEVEL_RANKING,
        DateTemplate.TOTAL,
        (_) => Promise.resolve(levelRanking),
        () => Promise.resolve(userFullProfiles),
      ),
    ]);
  }
}

const toUserRanking = <T extends UserFullProfile>(
  userFullProfiles: T[],
  compareFn: (a: T, b: T) => number,
  valueExtractor: (data: T) => number,
) =>
  userFullProfiles.sort(compareFn).map(
    (userFullProfile, index): UserRank => ({
      userPreview: {
        id: userFullProfile.cursusUser.user.id,
        login: userFullProfile.cursusUser.user.login,
        imgUrl: userFullProfile.cursusUser.user.image.link,
      },
      rank: index + 1,
      value: valueExtractor(userFullProfile),
    }),
  );
