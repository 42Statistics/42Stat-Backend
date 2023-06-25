import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { UserRankCache } from 'src/cache/cache.service';
import {
  CacheService,
  CacheSupportedDateTemplate,
} from 'src/cache/cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import { SEOUL_COALITION_ID } from '../coalition/coalition.service';
import { CursusUserCacheService } from '../cursusUser/cursusUser.cache.service';
import { scoreDateRangeFilter } from './db/score.database.aggregate';
import { ScoreService } from './score.service';

const SCORE_RANKING = 'scoreRanking';
export const TOTAL_SCORES_BY_COALITION = 'totalScoresByCoalition';
export const SCORE_RECORDS = 'scoreRecords';

export type ScoreRankingSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

export type ScoreRecordsKey = typeof SCORE_RECORDS;

@Injectable()
export class ScoreCacheService {
  constructor(
    private scoreService: ScoreService,
    private dateRangeServie: DateRangeService,
    private cursusUserCacheService: CursusUserCacheService,
    private cacheService: CacheService,
  ) {}

  async getScoreRank(
    dateTemplate: ScoreRankingSupportedDateTemplate,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheService.getRank(SCORE_RANKING, dateTemplate, userId);
  }

  async getScoreRanking(
    dateTemplate: ScoreRankingSupportedDateTemplate,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheService.getRanking(SCORE_RANKING, dateTemplate);
  }

  async getTotalScoresPerCoalition(): Promise<
    ReturnType<ScoreService['scoresPerCoalition']> | undefined
  > {
    return await this.cacheService.get(TOTAL_SCORES_BY_COALITION);
  }

  async getScoreRecords(): Promise<
    ReturnType<ScoreService['scoreRecordsPerCoalition']> | undefined
  > {
    return await this.cacheService.get(SCORE_RECORDS);
  }

  // todo: prod 때 빈도 늘리기
  @Cron(CronExpression.EVERY_MINUTE)
  // eslint-disable-next-line
  private async updateScore(): Promise<void> {
    console.debug('enter scoreCache at', new Date().toLocaleString());

    try {
      await this.updateScoreRanking();
    } catch (e) {
      console.error('scoreRanking', e);
    }

    try {
      await this.updateTotalScoresPerCoalition();
    } catch (e) {
      console.error('totalScoresPerCoalition', e);
    }

    try {
      await this.updateScoreRecords();
    } catch (e) {
      console.error('scoreRecords', e);
    }

    console.debug('leavning scoreCache at', new Date().toLocaleString());
  }

  private async updateScoreRanking(): Promise<void> {
    await Promise.all([
      await this.updateScoreRankingCacheByDateTemplate(DateTemplate.TOTAL),
      await this.updateScoreRankingCacheByDateTemplate(DateTemplate.CURR_MONTH),
      await this.updateScoreRankingCacheByDateTemplate(DateTemplate.CURR_WEEK),
    ]);
  }

  private async updateScoreRankingCacheByDateTemplate(
    dateTemplate: ScoreRankingSupportedDateTemplate,
  ): Promise<void> {
    await this.cacheService.updateRanking(
      SCORE_RANKING,
      dateTemplate,
      async (dateRange) =>
        await this.scoreService.scoreRanking(scoreDateRangeFilter(dateRange)),
      async () => {
        const userFullProfiles =
          await this.cursusUserCacheService.getAllUserFullProfile();

        assertExist(userFullProfiles);

        return [...userFullProfiles.values()];
      },
    );
  }

  private async updateTotalScoresPerCoalition(): Promise<void> {
    const totalScores = await this.scoreService.scoresPerCoalition();

    await this.cacheService.set(TOTAL_SCORES_BY_COALITION, totalScores);
  }

  private async updateScoreRecords(): Promise<void> {
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

    await this.cacheService.set(SCORE_RECORDS, scoreRecords);
  }
}
