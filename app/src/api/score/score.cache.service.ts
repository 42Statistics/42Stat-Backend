import { Injectable } from '@nestjs/common';
import {
  CacheUtilRankingService,
  type GetRankArgs,
  type GetRankingArgs,
  type RankCache,
  type RankingSupportedDateTemplate,
} from 'src/cache/cache.util.ranking.service';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { ScoreService } from './score.service';

export const SCORE_RANKING = 'scoreRanking';
export const TOTAL_SCORES_BY_COALITION = 'totalScoresByCoalition';
export const SCORE_RECORDS = 'scoreRecords';
export const WIN_COUNT_PER_COALITION = 'winCountPerCoalition';

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
    cacheArgs: Omit<GetRankArgs, 'keyBase'>,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRank({
      keyBase: SCORE_RANKING,
      ...cacheArgs,
    });
  }

  async getScoreRanking(
    cacheArgs: Omit<GetRankingArgs, 'keyBase'>,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRanking({
      keyBase: SCORE_RANKING,
      ...cacheArgs,
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

  async getWinCountPerCoalition(): Promise<
    ReturnType<ScoreService['winCountPerCoalition']> | undefined
  > {
    return await this.cacheUtilService.getWithoutDate(WIN_COUNT_PER_COALITION);
  }
}
