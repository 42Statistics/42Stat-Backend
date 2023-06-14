import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { ExperienceUserService } from './experienceUser.service';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import { Cron, CronExpression } from '@nestjs/schedule';

const EXP_INCREAMENT_RANKING = 'expIncRanking';
export const EXP_INCREAMENT_RANKING_MONTHLY =
  EXP_INCREAMENT_RANKING + ':monthly';
export const EXP_INCREAMENT_RANKING_WEEKLY = EXP_INCREAMENT_RANKING + ':weekly';

export type ExpInceamentRankingCacheKey =
  | typeof EXP_INCREAMENT_RANKING_MONTHLY
  | typeof EXP_INCREAMENT_RANKING_WEEKLY;

@Injectable()
export class ExperienceUserCacheService {
  constructor(
    private experienceUserService: ExperienceUserService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getExpIncreamentRankingCache(
    key: ExpInceamentRankingCacheKey,
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

  async getExpIncreamentRankingCacheByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<
    ReturnType<ExperienceUserService['increamentRanking']> | undefined
  > {
    const cacheKey = selectExpIncreamentCacheKeyByDateTemplate(dateTemplate);

    return cacheKey
      ? await this.getExpIncreamentRankingCache(cacheKey)
      : undefined;
  }

  // todo: prod 때 빈도 늘리기
  @Cron(CronExpression.EVERY_MINUTE)
  private async updateExperienceUserCache(): Promise<void> {
    console.debug('enter experienceUserCache at', new Date().toLocaleString());

    try {
      await this.updateExpIncreamentRankingCache();
      console.debug('done expIncreamentRanking');
    } catch {}

    console.debug('leaving experienceUserCache', new Date().toLocaleString());
  }

  private async updateExpIncreamentRankingCache(): Promise<void> {
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
      EXP_INCREAMENT_RANKING_MONTHLY,
      monthly,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EXP_INCREAMENT_RANKING_WEEKLY,
      weekly,
    );
  }
}

const selectExpIncreamentCacheKeyByDateTemplate = (
  dateTemplate: DateTemplate,
): ExpInceamentRankingCacheKey | undefined => {
  switch (dateTemplate) {
    case DateTemplate.CURR_MONTH:
      return EXP_INCREAMENT_RANKING_MONTHLY;
    case DateTemplate.CURR_WEEK:
      return EXP_INCREAMENT_RANKING_WEEKLY;
    default:
      return undefined;
  }
};
