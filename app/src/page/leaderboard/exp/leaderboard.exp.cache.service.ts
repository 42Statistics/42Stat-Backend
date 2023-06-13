import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { StatDate } from 'src/statDate/StatDate';

const EXP_INCREAMENT_RANK = 'expIncRank';
export const EXP_INCREAMENT_RANK_MONTHLY = EXP_INCREAMENT_RANK + ':monthly';
export const EXP_INCREAMENT_RANK_WEEKLY = EXP_INCREAMENT_RANK + ':weekly';

export type ExpInceamentRankCacheKey =
  | typeof EXP_INCREAMENT_RANK_MONTHLY
  | typeof EXP_INCREAMENT_RANK_WEEKLY;

@Injectable()
export class LeaderboardExpCacheService {
  constructor(
    private experienceUserService: ExperienceUserService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getExpIncreamentRankCache(
    key: ExpInceamentRankCacheKey,
  ): Promise<
    ReturnType<ExperienceUserService['increamentRanking']> | undefined
  > {
    const caches = await this.redisClient.get(key);

    if (!caches) {
      return undefined;
    }

    return JSON.parse(caches) as ReturnType<
      ExperienceUserService['increamentRanking']
    >;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateEvalRankCache(): Promise<void> {
    const currMonth = StatDate.currMonth();
    const nextMonth = StatDate.nextMonth();
    const currWeek = StatDate.currWeek();
    const nextWeek = StatDate.nextWeek();

    const monthly = await this.experienceUserService.increamentRanking({
      createdAt: { $gte: currMonth, $lt: nextMonth },
    });
    const weekly = await this.experienceUserService.increamentRanking({
      createdAt: { $gte: currWeek, $lt: nextWeek },
    });

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EXP_INCREAMENT_RANK_MONTHLY,
      monthly,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EXP_INCREAMENT_RANK_WEEKLY,
      weekly,
    );
  }
}
