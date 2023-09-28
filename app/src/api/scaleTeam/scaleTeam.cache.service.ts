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
import { ScaleTeamService } from './scaleTeam.service';
export const EVAL_COUNT_RANKING = 'evalCountRanking';
export const COMMENT_RANKING = 'commentRanking';
export const AVERAGE_FEEDBACK_LENGTH = 'averageFeedbackLength';
export const AVERAGE_COMMENT_LENGTH = 'averageCommentLength';

export type EvalCountRankingSupportedDateTemplate = Extract<
  RankingSupportedDateTemplate,
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
  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cacheUtilRankingService: CacheUtilRankingService,
  ) {}

  async getEvalCountRank(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
    userId: number,
    promo?: number,
  ): Promise<RankCache | undefined> {
    const args: GetRankArgs = {
      keyBase: EVAL_COUNT_RANKING,
      userId,
      dateTemplate,
      promo,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilRankingService.getRawRank(args);
    }

    return await this.cacheUtilRankingService.getRank(args);
  }

  async getEvalCountRanking(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
    promo?: number,
  ): Promise<RankCache[] | undefined> {
    const args: GetRankingArgs = {
      keyBase: EVAL_COUNT_RANKING,
      dateTemplate,
      promo,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilRankingService.getRawRanking(args);
    }

    return await this.cacheUtilRankingService.getRanking(args);
  }

  async getAverageReviewLength(
    key: AverageReviewLengthKey,
  ): Promise<AverageReviewLengthCache> {
    return await this.cacheUtilService.getWithoutDate<AverageReviewLengthCache>(
      key,
    );
  }

  async getCommentRank(
    userId: number,
    promo?: number,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRawRank({
      keyBase: COMMENT_RANKING,
      userId,
      dateTemplate: DateTemplate.TOTAL,
      promo,
    });
  }

  async getCommentRanking(promo?: number): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRawRanking({
      keyBase: COMMENT_RANKING,
      dateTemplate: DateTemplate.TOTAL,
      promo,
    });
  }
}
