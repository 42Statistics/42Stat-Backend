import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { StatDate } from 'src/statDate/StatDate';
import { ScaleTeamService } from './scaleTeam.service';

const EVAL_COUNT_RANKING = 'evalCountRanking';
export const EVAL_COUNT_RANKING_TOTAL = EVAL_COUNT_RANKING + ':total';
export const EVAL_COUNT_RANKING_MONTHLY = EVAL_COUNT_RANKING + ':monthly';
export const EVAL_COUNT_RANKING_WEEKLY = EVAL_COUNT_RANKING + ':weekly';
export const AVERAGE_FEEDBACK_LENGTH = 'averageFeedbackLength';
export const AVERAGE_COMMENT_LENGTH = 'averageCommentLength';

export type EvalCountRankingCacheKey =
  | typeof EVAL_COUNT_RANKING_TOTAL
  | typeof EVAL_COUNT_RANKING_MONTHLY
  | typeof EVAL_COUNT_RANKING_WEEKLY;

export type AverageReviewLengthKey =
  | typeof AVERAGE_COMMENT_LENGTH
  | typeof AVERAGE_FEEDBACK_LENGTH;

@Injectable()
export class ScaleTeamCacheService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getEvalCountRankingCache(
    key: EvalCountRankingCacheKey,
  ): Promise<ReturnType<ScaleTeamService['evalCountRanking']> | undefined> {
    const cached = await this.redisClient.get(key);

    if (!cached) {
      return undefined;
    }

    return JSON.parse(cached) as Awaited<
      ReturnType<ScaleTeamService['evalCountRanking']>
    >;
  }

  async getAverageReviewLengthCache(
    key: AverageReviewLengthKey,
  ): Promise<ReturnType<ScaleTeamService['averageReviewLength']> | undefined> {
    const cached = await this.redisClient.get(key);

    if (!cached) {
      return undefined;
    }

    return parseInt(JSON.parse(cached));
  }

  async getEvalCountRankingCacheByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<ReturnType<ScaleTeamService['evalCountRanking']> | undefined> {
    const cacheKey = selectEvalCountRankingCacheKeyByDateTemplate(dateTemplate);

    if (!cacheKey) {
      return undefined;
    }

    return await this.getEvalCountRankingCache(cacheKey);
  }

  // todo: prod 때 빈도 줄이기
  @Cron(CronExpression.EVERY_MINUTE)
  // eslint-disable-next-line
  private async updateScaleTeamCache(): Promise<void> {
    console.debug('enter scaleTeamCache at', new Date().toLocaleString());

    // todo: 이거 어떻게 안되나...
    try {
      await this.updateEvalCountRankingCache();
      console.debug('evalCountRanking done');
    } catch {}

    try {
      await this.updateAverageReviewLength();
      console.debug('averageReviewLength done');
    } catch {}

    console.debug('leaving scaleTeamCache at', new Date().toLocaleString());
  }

  private async updateEvalCountRankingCache(): Promise<void> {
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
      EVAL_COUNT_RANKING_TOTAL,
      total,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EVAL_COUNT_RANKING_MONTHLY,
      monthly,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      EVAL_COUNT_RANKING_WEEKLY,
      weekly,
    );
  }

  private async updateAverageReviewLength(): Promise<void> {
    const averageCommentLength =
      await this.scaleTeamService.averageReviewLength('comment');
    const averageFeedbackLength =
      await this.scaleTeamService.averageReviewLength('feedback');

    await this.redisUtilService.replaceKey(
      this.redisClient,
      AVERAGE_COMMENT_LENGTH,
      averageCommentLength.toString(),
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      AVERAGE_FEEDBACK_LENGTH,
      averageFeedbackLength.toString(),
    );
  }
}

const selectEvalCountRankingCacheKeyByDateTemplate = (
  dateTemplate: DateTemplate,
): EvalCountRankingCacheKey | undefined => {
  switch (dateTemplate) {
    case DateTemplate.CURR_MONTH:
      return EVAL_COUNT_RANKING_MONTHLY;
    case DateTemplate.CURR_WEEK:
      return EVAL_COUNT_RANKING_WEEKLY;
    default:
      return undefined;
  }
};
