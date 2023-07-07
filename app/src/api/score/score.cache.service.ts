import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type CacheSupportedDateTemplate,
  type UserRankCache,
} from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { ScoreService } from './score.service';

export const SCORE_RANKING = 'scoreRanking';
export const TOTAL_SCORES_BY_COALITION = 'totalScoresByCoalition';
export const SCORE_RECORDS = 'scoreRecords';

export type ScoreRankingSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

export type ScoreRecordsKey = typeof SCORE_RECORDS;

@Injectable()
export class ScoreCacheService {
  constructor(private cacheUtilService: CacheUtilService) {}

  async getScoreRank(
    dateTemplate: ScoreRankingSupportedDateTemplate,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheUtilService.getRank({
      keyBase: SCORE_RANKING,
      userId,
      dateTemplate,
    });
  }

  async getScoreRanking(
    dateTemplate: ScoreRankingSupportedDateTemplate,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheUtilService.getRanking({
      keyBase: SCORE_RANKING,
      dateTemplate,
    });
  }

  async getTotalScoresPerCoalition(): Promise<
    ReturnType<ScoreService['scoresPerCoalition']> | undefined
  > {
    return await this.cacheUtilService.getWithoutDate(
      TOTAL_SCORES_BY_COALITION,
    );
  }

  async getScoreRecords(): Promise<
    ReturnType<ScoreService['scoreRecordsPerCoalition']> | undefined
  > {
    return await this.cacheUtilService.getWithoutDate(SCORE_RECORDS);
  }
}
