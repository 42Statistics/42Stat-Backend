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

export const AVERAGE_FEEDBACK_LENGTH = 'averageFeedbackLength';
export const AVERAGE_COMMENT_LENGTH = 'averageCommentLength';

export const COMMENT_RANKING = 'commentRanking';

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

export type AverageReviewLengthRankingSupportedDateTemplate = Extract<
  RankingSupportedDateTemplate,
  DateTemplate.TOTAL | DateTemplate.CURR_MONTH | DateTemplate.CURR_WEEK
>;

@Injectable()
export class ScaleTeamCacheService {
  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cacheUtilRankingService: CacheUtilRankingService,
  ) {}

  async getEvalCountRank(
    cacheArgs: Omit<GetRankArgs, 'keyBase'>,
  ): Promise<RankCache | undefined> {
    const args: GetRankArgs = {
      keyBase: EVAL_COUNT_RANKING,
      ...cacheArgs,
    };

    if (cacheArgs.dateTemplate === DateTemplate.TOTAL) {
      return await this.cacheUtilRankingService.getRawRank(args);
    }

    return await this.cacheUtilRankingService.getRank(args);
  }

  async getEvalCountRanking(
    cacheArgs: Omit<GetRankingArgs, 'keyBase'>,
  ): Promise<RankCache[] | undefined> {
    const args: GetRankingArgs = {
      keyBase: EVAL_COUNT_RANKING,
      ...cacheArgs,
    };

    if (cacheArgs.dateTemplate === DateTemplate.TOTAL) {
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
    cacheArgs: Omit<GetRankArgs, 'keyBase'>,
  ): Promise<RankCache | undefined> {
    return await this.cacheUtilRankingService.getRank({
      keyBase: COMMENT_RANKING,
      ...cacheArgs,
    });
  }

  async getCommentRanking(
    cacheArgs: Omit<GetRankingArgs, 'keyBase'>,
  ): Promise<RankCache[] | undefined> {
    return await this.cacheUtilRankingService.getRanking({
      keyBase: COMMENT_RANKING,
      ...cacheArgs,
    });
  }
}
