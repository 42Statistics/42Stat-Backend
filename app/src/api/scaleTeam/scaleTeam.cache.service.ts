import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { StatDate } from 'src/statDate/StatDate';
import { ScaleTeamService } from './scaleTeam.service';

const EVAL_COUNT_RANK = 'evalCountRank';
export const EVAL_COUNT_RANK_TOTAL = EVAL_COUNT_RANK + ':total';
export const EVAL_COUNT_RANK_MONTHLY = EVAL_COUNT_RANK + ':monthly';
export const EVAL_COUNT_RANK_WEEKLY = EVAL_COUNT_RANK + ':weekly';

export type EvalCountRankCacheKey =
  | typeof EVAL_COUNT_RANK_TOTAL
  | typeof EVAL_COUNT_RANK_MONTHLY
  | typeof EVAL_COUNT_RANK_WEEKLY;

const AVERAGE_FEEDBACK_LENGTH = 'averageFeedbackLength';
const AVERAGE_COMMENT_LENGTH = 'averageCommentLength';

@Injectable()
export class ScaleTeamCacheService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  selectCacheKeyByDateTemplate = (
    dateTemplate: DateTemplate,
  ): EvalCountRankCacheKey | undefined => {
    switch (dateTemplate) {
      case DateTemplate.CURR_MONTH:
        return EVAL_COUNT_RANK_MONTHLY;
      case DateTemplate.CURR_WEEK:
        return EVAL_COUNT_RANK_WEEKLY;
      default:
        return undefined;
    }
  };

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

  async getEvalCountRankCacheByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<ReturnType<ScaleTeamService['evalCountRanking']> | undefined> {
    const cacheKey = this.selectCacheKeyByDateTemplate(dateTemplate);

    if (!cacheKey) {
      return undefined;
    }

    return await this.getEvalCountRankCache(cacheKey);
  }

  // todo: prod 때 빈도 줄이기
  @Cron(CronExpression.EVERY_MINUTE)
  async updateScaleTeamCache(): Promise<void> {
    console.log('enter at', new Date().toLocaleString());

    // todo: 이거 어떻게 안되나...
    try {
      await this.updateEvalCountRankCache();
    } catch {}

    console.log('leaving at', new Date().toLocaleString());
  }

  private async updateEvalCountRankCache(): Promise<void> {
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
