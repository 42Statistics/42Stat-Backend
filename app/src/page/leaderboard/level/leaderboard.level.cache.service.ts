import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';

const LEVEL_RANK = 'levelRank';
export const LEVEL_RANK_TOTAL = LEVEL_RANK + ':total';

export type LevelRankCacheKey = typeof LEVEL_RANK_TOTAL;

@Injectable()
export class LeaderboardLevelCacheService {
  constructor(
    private cursusUserService: CursusUserService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getLevelRankCache(
    key: LevelRankCacheKey,
  ): Promise<ReturnType<CursusUserService['ranking']> | undefined> {
    const caches = await this.redisClient.get(key);

    if (!caches) {
      return undefined;
    }

    return JSON.parse(caches) as ReturnType<CursusUserService['ranking']>;
  }

  // todo: prod 때 빈도 늘리기
  @Cron(CronExpression.EVERY_MINUTE)
  async updateEvalCountRankCache(): Promise<void> {
    const total = await this.cursusUserService.ranking(
      { sort: { level: -1 } },
      (cursusUser: cursus_user) => cursusUser.level,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      LEVEL_RANK_TOTAL,
      total,
    );
  }
}
