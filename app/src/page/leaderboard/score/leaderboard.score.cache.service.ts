import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { RedisClientType } from 'redis';
import { ScoreService } from 'src/api/score/score.service';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisUtilService } from 'src/redis/redis.util.service';
import { StatDate } from 'src/statDate/StatDate';

const SCORE_RANK = 'scoreRank';
export const SCORE_RANK_TOTAL = SCORE_RANK + ':total';
export const SCORE_RANK_MONTHLY = SCORE_RANK + ':monthly';
export const SCORE_RANK_WEEKLY = SCORE_RANK + ':weekly';

export type ScoreRankCacheKey =
  | typeof SCORE_RANK_TOTAL
  | typeof SCORE_RANK_MONTHLY
  | typeof SCORE_RANK_WEEKLY;

@Injectable()
export class LeaderboardScoreCacheService {
  constructor(
    private scoreService: ScoreService,
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClientType,
    private redisUtilService: RedisUtilService,
  ) {}

  async getScoreRankCache(
    key: ScoreRankCacheKey,
  ): Promise<ReturnType<ScoreService['scoreRanking']> | undefined> {
    const caches = await this.redisClient.get(key);

    if (!caches) {
      return undefined;
    }

    return JSON.parse(caches) as ReturnType<ScoreService['scoreRanking']>;
  }

  // todo: prod 때 빈도 늘리기
  @Cron(CronExpression.EVERY_MINUTE)
  async updateEvalCountRankCache(): Promise<void> {
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
      SCORE_RANK_TOTAL,
      total,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      SCORE_RANK_MONTHLY,
      monthly,
    );

    await this.redisUtilService.replaceKey(
      this.redisClient,
      SCORE_RANK_WEEKLY,
      weekly,
    );
  }
}
