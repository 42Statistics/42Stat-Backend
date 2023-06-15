import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { ScoreService } from './score.service';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatDate } from 'src/statDate/StatDate';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { SEOUL_COALITION_ID } from '../coalition/coalition.service';

const SCORE_RANKING = 'scoreRanking';
export const SCORE_RANKING_TOTAL = SCORE_RANKING + ':total';
export const SCORE_RANKING_MONTHLY = SCORE_RANKING + ':monthly';
export const SCORE_RANKING_WEEKLY = SCORE_RANKING + ':weekly';
export const TOTAL_SCORES_BY_COALITION = 'totalScoresByCoalition';
export const SCORE_RECORDS = 'scoreRecords';

export type ScoreRankCacheKey =
  | typeof SCORE_RANKING_TOTAL
  | typeof SCORE_RANKING_MONTHLY
  | typeof SCORE_RANKING_WEEKLY;

export type ScoreRecordsKey = typeof SCORE_RECORDS;

@Injectable()
export class ScoreCacheService {
  constructor(
    private scoreService: ScoreService,
    private dateRangeServie: DateRangeService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getScoreRankingCache(
    key: ScoreRankCacheKey,
  ): Promise<ReturnType<ScoreService['scoreRanking']> | undefined> {
    const cached = await this.redisClient.get(key);

    if (!cached) {
      return undefined;
    }

    return JSON.parse(cached) as Awaited<
      ReturnType<ScoreService['scoreRanking']>
    >;
  }

  async getScoreRankingCacheByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<ReturnType<ScoreService['scoreRanking']> | undefined> {
    const cacheKey = selectScoreRankCacheKeyByDateTemplate(dateTemplate);

    return cacheKey ? await this.getScoreRankingCache(cacheKey) : undefined;
  }

  async getTotalScoresPerCoalitionCache(): Promise<
    ReturnType<ScoreService['scoresPerCoalition']> | undefined
  > {
    const cached = await this.redisClient.get(TOTAL_SCORES_BY_COALITION);

    if (!cached) {
      return undefined;
    }

    return JSON.parse(cached) as Promise<
      ReturnType<ScoreService['scoresPerCoalition']> | undefined
    >;
  }

  async getScoreRecordsCache(): Promise<
    ReturnType<ScoreService['scoreRecordsPerCoalition']> | undefined
  > {
    const cached = await this.redisClient.get(SCORE_RECORDS);

    if (!cached) {
      return undefined;
    }

    return JSON.parse(cached, (key, value) => {
      if (key === 'at') {
        return new Date(value);
      }

      return value;
    }) as Awaited<ReturnType<ScoreService['scoreRecordsPerCoalition']>>;
  }

  // todo: prod 때 빈도 늘리기
  @Cron(CronExpression.EVERY_MINUTE)
  // eslint-disable-next-line
  private async updateScoreCache(): Promise<void> {
    console.debug('enter scoreCache at', new Date().toLocaleString());

    try {
      await this.updateScoreRankingCache();
    } catch (e) {
      console.error('scoreRanking', e);
    }

    try {
      await this.updateTotalScoresPerCoalitionCache();
    } catch (e) {
      console.error('totalScoresPerCoalition', e);
    }

    try {
      await this.updateScoreRecordsCache();
    } catch (e) {
      console.error('scoreRecords', e);
    }

    console.debug('leavning scoreCache at', new Date().toLocaleString());
  }

  private async updateScoreRankingCache(): Promise<void> {
    const currMonth = StatDate.currMonth();
    const nextMonth = StatDate.nextMonth();
    const currWeek = StatDate.currWeek();
    const nextWeek = StatDate.nextWeek();

    const total = await this.scoreService.scoreRanking();
    const monthly = await this.scoreService.scoreRanking({
      createdAt: { $gte: currMonth, $lt: nextMonth },
    });
    const weekly = await this.scoreService.scoreRanking({
      createdAt: { $gte: currWeek, $lt: nextWeek },
    });

    await this.redisUtilService.replaceKey(
      this.redisClient,
      SCORE_RANKING_TOTAL,
      total,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      SCORE_RANKING_MONTHLY,
      monthly,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      SCORE_RANKING_WEEKLY,
      weekly,
    );
  }

  private async updateTotalScoresPerCoalitionCache(): Promise<void> {
    const totalScores = await this.scoreService.scoresPerCoalition();

    await this.redisUtilService.replaceKey(
      this.redisClient,
      TOTAL_SCORES_BY_COALITION,
      totalScores,
    );
  }

  private async updateScoreRecordsCache(): Promise<void> {
    const currMonth = StatDate.currMonth();
    const lastYear = currMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear,
      end: currMonth,
    };

    const scoreRecords = await this.scoreService.scoreRecordsPerCoalition({
      createdAt: this.dateRangeServie.aggrFilterFromDateRange(dateRange),
      coalitionsUserId: { $ne: null },
      coalitionId: { $in: SEOUL_COALITION_ID },
    });

    await this.redisUtilService.replaceKey(
      this.redisClient,
      SCORE_RECORDS,
      scoreRecords,
    );
  }
}

const selectScoreRankCacheKeyByDateTemplate = (
  dateTemplate: DateTemplate,
): ScoreRankCacheKey | undefined => {
  switch (dateTemplate) {
    case DateTemplate.CURR_MONTH:
      return SCORE_RANKING_MONTHLY;
    case DateTemplate.CURR_WEEK:
      return SCORE_RANKING_WEEKLY;
    default:
      return undefined;
  }
};
