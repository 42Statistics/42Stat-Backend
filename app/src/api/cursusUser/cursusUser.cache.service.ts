import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import type { UserRank } from 'src/common/models/common.user.model';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { CursusUserService } from './cursusUser.service';
import type { UserFullProfile } from './db/cursusUser.database.aggregate';

export const USER_WALLET_RANKING = 'userWalletRanking';
export const USER_LEVEL_RANKING = 'userLevelRanking';
export const USER_CORRECTION_POINT_RANKING = 'userCorrectionPointRanking';

type RankingType = Awaited<ReturnType<CursusUserService['ranking']>>;

export type UserRankingKey =
  | typeof USER_WALLET_RANKING
  | typeof USER_LEVEL_RANKING
  | typeof USER_CORRECTION_POINT_RANKING;

export const USER_FULL_PROFILE_CACHE = 'userFullProfile';

@Injectable()
export class CursusUserCacheService {
  constructor(
    private cursusUserService: CursusUserService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getUserFullProfileCacheByUserId(
    userId: number,
  ): Promise<
    ReturnType<CursusUserService['findOneUserFullProfilebyUserId']> | undefined
  > {
    const cached = await this.redisClient.hGet(
      USER_FULL_PROFILE_CACHE,
      userId.toString(),
    );

    if (!cached) {
      return undefined;
    }

    return JSON.parse(cached, userFullProfileReviver) as Awaited<
      ReturnType<CursusUserService['findOneUserFullProfilebyUserId']>
    >;
  }

  async getAllUserFullProfileCache(): Promise<UserFullProfile[] | undefined> {
    const cached = await this.redisClient.hGetAll(USER_FULL_PROFILE_CACHE);

    if (!Object.keys(cached).length) {
      return undefined;
    }

    return Object.values(cached).map(
      (cache) => JSON.parse(cache) as UserFullProfile,
    );
  }

  async getUserRanking(key: UserRankingKey): Promise<RankingType | undefined> {
    const cached = await this.redisClient.get(key);

    if (!cached) {
      return undefined;
    }

    return JSON.parse(cached) as RankingType;
  }

  // todo: 빈도 조절
  @Cron(CronExpression.EVERY_MINUTE)
  // eslint-disable-next-line
  private async updateCursusUserCache(): Promise<void> {
    console.debug('enter cursusUserCache at', new Date().toLocaleString());

    try {
      await this.updateUserFullProfileCache();
    } catch (e) {
      console.error('userFullProfileCache', e);
    }

    console.debug('leaving cursusUserCache at', new Date().toLocaleString());
  }

  private async updateUserFullProfileCache(): Promise<void> {
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

    await this.redisUtilService.replaceHash(
      this.redisClient,
      USER_FULL_PROFILE_CACHE,
      userFullProfiles,
      (userFullProfile) => userFullProfile.cursusUser.user.id,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      USER_WALLET_RANKING,
      walletRanking,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      USER_LEVEL_RANKING,
      levelRanking,
    );
  }
}

const userFullProfileReviver: Parameters<typeof JSON.parse>[1] = (
  key,
  value,
) => {
  if (key === 'createdAt' || key === 'updatedAt' || key === 'beginAt') {
    return new Date(value);
  }

  if (key === 'blackholedAt' && value !== null) {
    return new Date(value);
  }

  return value;
};

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
