import { Injectable } from '@nestjs/common';
import {
  CacheUtilService,
  type CacheSupportedDateTemplate,
  type GetRankArgs,
  type GetRankingArgs,
  type RankCache,
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
    const args: GetRankArgs = {
      keyBase: EVAL_COUNT_RANKING,
      userId,
      dateTemplate,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilService.getRawRank(args);
    }

    return await this.cacheUtilService.getRank(args);
  }

  async getEvalCountRanking(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
  ): Promise<RankCache[] | undefined> {
    const args: GetRankingArgs = {
      keyBase: EVAL_COUNT_RANKING,
      dateTemplate,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilService.getRawRanking(args);
    }

    return await this.cacheUtilService.getRanking(args);
  }

  async getAverageReviewLength(
    key: AverageReviewLengthKey,
  ): Promise<AverageReviewLengthCache> {
    return await this.cacheUtilService.getWithoutDate<AverageReviewLengthCache>(
      key,
    );
  }
}
