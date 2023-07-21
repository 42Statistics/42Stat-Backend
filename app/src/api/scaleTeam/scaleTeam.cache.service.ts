import { Injectable } from '@nestjs/common';
import {
  type CacheSupportedDateTemplate,
  CacheUtilService,
  type RankCache,
  RankingCacheMap,
} from 'src/cache/cache.util.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { ScaleTeamService } from './scaleTeam.service';

export const EVAL_COUNT_RANKING = 'evalCountRanking';
export const AVERAGE_FEEDBACK_LENGTH = 'averageFeedbackLength';
export const AVERAGE_COMMENT_LENGTH = 'averageCommentLength';

export type EvalCountRankingSupportedDateTemplate = Extract<
  CacheSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

export type AverageReviewLengthKey =
  | typeof AVERAGE_COMMENT_LENGTH
  | typeof AVERAGE_FEEDBACK_LENGTH;

type AverageReviewLengthCache = Awaited<
  ReturnType<ScaleTeamService['averageReviewLength']> | undefined
>;

@Injectable()
export class ScaleTeamCacheService {
  constructor(private readonly cacheUtilService: CacheUtilService) {}

  async getEvalCountRank(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
    userId: number,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilService.getRank({
      keyBase: EVAL_COUNT_RANKING,
      userId,
      dateTemplate,
    });
  }

  async getEvalCountRanking(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilService.getRanking({
      keyBase: EVAL_COUNT_RANKING,
      dateTemplate,
    });
  }

  async getEvalCountRankingMap(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
  ): Promise<RankingCacheMap | undefined> {
    return await this.cacheUtilService.getRankingMap({
      keyBase: EVAL_COUNT_RANKING,
      dateTemplate,
    });
  }

  async getAverageReviewLength(
    key: AverageReviewLengthKey,
  ): Promise<AverageReviewLengthCache> {
    return await this.cacheUtilService.getWithoutDate<AverageReviewLengthCache>(
      key,
    );
  }
}
