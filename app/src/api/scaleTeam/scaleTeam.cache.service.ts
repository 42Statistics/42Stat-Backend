import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { UserRankCache } from 'src/cache/cache.service';
import {
  CacheService,
  CacheSupportedDateTemplate,
} from 'src/cache/cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { CursusUserCacheService } from '../cursusUser/cursusUser.cache.service';
import { evalCountDateRangeFilter } from './db/scaleTeam.database.aggregate';
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
  constructor(
    private scaleTeamService: ScaleTeamService,
    private cursusUserCacheService: CursusUserCacheService,
    private cacheService: CacheService,
  ) {}

  async getEvalCountRank(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
    userId: number,
  ): Promise<UserRankCache | undefined> {
    return await this.cacheService.getRank(
      EVAL_COUNT_RANKING,
      dateTemplate,
      userId,
    );
  }

  async getEvalCountRanking(
    dateTemplate: EvalCountRankingSupportedDateTemplate,
  ): Promise<UserRankCache[] | undefined> {
    return await this.cacheService.getRanking(EVAL_COUNT_RANKING, dateTemplate);
  }

  async getAverageReviewLength(
    key: AverageReviewLengthKey,
  ): Promise<AverageReviewLengthCache> {
    return await this.cacheService.get<AverageReviewLengthCache>(key);
  }

  // todo: prod 때 빈도 줄이기
  @Cron(CronExpression.EVERY_MINUTE)
  // eslint-disable-next-line
  private async updateScaleTeam(): Promise<void> {
    console.debug('enter scaleTeamCache at', new Date().toLocaleString());

    // todo: 이거 어떻게 안되나...
    try {
      await this.updateEvalCountRanking();
    } catch (e) {
      console.error('evalCountRanking', e);
    }

    try {
      await this.updateAverageReviewLength();
    } catch (e) {
      console.error('averageReviewLength', e);
    }

    console.debug('leaving scaleTeamCache at', new Date().toLocaleString());
  }

  private async updateEvalCountRanking(): Promise<void> {
    await Promise.all([
      this.updateEvalCountRankingByDateTemplate(DateTemplate.TOTAL),
      this.updateEvalCountRankingByDateTemplate(DateTemplate.CURR_MONTH),
      this.updateEvalCountRankingByDateTemplate(DateTemplate.CURR_WEEK),
    ]);
  }

  private updateEvalCountRankingByDateTemplate = async (
    dateTemplate: EvalCountRankingSupportedDateTemplate,
  ): Promise<void> => {
    await this.cacheService.updateRanking(
      EVAL_COUNT_RANKING,
      dateTemplate,
      async (dateRange) =>
        await this.scaleTeamService.evalCountRanking(
          evalCountDateRangeFilter(dateRange),
        ),
      async () => {
        const userFullProfiles =
          await this.cursusUserCacheService.getAllUserFullProfile();

        assertExist(userFullProfiles);

        return [...userFullProfiles.values()];
      },
    );
  };

  private async updateAverageReviewLength(): Promise<void> {
    const averageCommentLength =
      await this.scaleTeamService.averageReviewLength('comment');
    const averageFeedbackLength =
      await this.scaleTeamService.averageReviewLength('feedback');

    await this.cacheService.set(AVERAGE_COMMENT_LENGTH, averageCommentLength);
    await this.cacheService.set(AVERAGE_FEEDBACK_LENGTH, averageFeedbackLength);
  }
}
