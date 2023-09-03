import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type RankCache,
  type RankingSupportedDateTemplate,
} from 'src/cache/cache.util.ranking.service';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { ScoreService } from './score.service';

export const SCORE_RANKING = 'scoreRanking';
export const TOTAL_SCORES_BY_COALITION = 'totalScoresByCoalition';
export const SCORE_RECORDS = 'scoreRecords';

export type ScoreRankingSupportedDateTemplate = Extract<
  RankingSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

export type ScoreRecordsKey = typeof SCORE_RECORDS;

@Injectable()
export class ScoreCacheService {
  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cacheUtilRankingService: CacheUtilRankingService,
  ) {}

  async getScoreRank(
    dateTemplate: ScoreRankingSupportedDateTemplate,
    userId: number,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRank({
      keyBase: SCORE_RANKING,
      userId,
      dateTemplate,
    });
  }

  async getScoreRanking(
    dateTemplate: ScoreRankingSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRanking({
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
