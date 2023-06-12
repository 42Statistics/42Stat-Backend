import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { StatDate } from 'src/statDate/StatDate';

const EVAL_COUNT_RANK = 'evalCountRank';
export const EVAL_COUNT_RANK_TOTAL = EVAL_COUNT_RANK + ':total';
export const EVAL_COUNT_RANK_MONTHLY = EVAL_COUNT_RANK + ':monthly';
export const EVAL_COUNT_RANK_WEEKLY = EVAL_COUNT_RANK + ':weekly';

export type EvalCountRankCacheKey =
  | typeof EVAL_COUNT_RANK_TOTAL
  | typeof EVAL_COUNT_RANK_MONTHLY
  | typeof EVAL_COUNT_RANK_WEEKLY;

@Injectable()
export class LeaderboardEvalCacheService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getEvalCountRankCache(
    key: EvalCountRankCacheKey,
  ): Promise<ReturnType<ScaleTeamService['evalCountRanking']> | undefined> {
    const caches = await this.redisClient.get(key);

    if (!caches) {
      return undefined;
    }

    return JSON.parse(caches) as ReturnType<
      ScaleTeamService['evalCountRanking']
    >;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateEvalCountRankCache(): Promise<void> {
    const currMonth = StatDate.currMonth();
    const nextMonth = StatDate.nextMonth();
    const currWeek = StatDate.currWeek();
    const nextWeek = StatDate.nextWeek();

    const total = await this.scaleTeamService.evalCountRanking();
    const monthly = await this.scaleTeamService.evalCountRanking({
      beginAt: { $gte: currMonth, $lt: nextMonth },
    });
    const weekly = await this.scaleTeamService.evalCountRanking({
      beginAt: { $gte: currWeek, $lt: nextWeek },
    });

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EVAL_COUNT_RANK_TOTAL,
      total,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EVAL_COUNT_RANK_MONTHLY,
      monthly,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EVAL_COUNT_RANK_WEEKLY,
      weekly,
    );
  }
}
