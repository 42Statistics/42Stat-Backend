import { BadRequestException, Injectable } from '@nestjs/common';
import {
  USER_CORRECTION_POINT_RANKING,
  USER_LEVEL_RANKING,
  USER_WALLET_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { UserFullProfile } from 'src/api/cursusUser/db/cursusUser.database.aggregate';
import { expIncreamentDateFilter } from 'src/api/experienceUser/db/experiecneUser.database.aggregate';
import { EXP_INCREAMENT_RANKING } from 'src/api/experienceUser/experienceUser.cache.service';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { LOGTIME_RANKING } from 'src/api/location/location.cache.service';
import { LocationService } from 'src/api/location/location.service';
import { evalCountDateRangeFilter } from 'src/api/scaleTeam/db/scaleTeam.database.aggregate';
import {
  AVERAGE_COMMENT_LENGTH,
  AVERAGE_FEEDBACK_LENGTH,
  EVAL_COUNT_RANKING,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { scoreDateRangeFilter } from 'src/api/score/db/score.database.aggregate';
import {
  SCORE_RANKING,
  SCORE_RECORDS,
  TOTAL_SCORES_BY_COALITION,
} from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import {
  CacheSupportedDateTemplate,
  CacheUtilService,
  type RankingCacheMap,
} from 'src/cache/cache.util.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/statDate/StatDate';

type UpdateRankingByDateTemplateFn = (
  updatedAt: Date,
  dateTemplate: CacheSupportedDateTemplate,
) => Promise<void>;

export const LAMBDA_UPDATED_AT = 'lambdaUpdatedAt';

@Injectable()
export class LambdaService {
  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cursusUserService: CursusUserService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scoreService: ScoreService,
    private readonly experienceUserService: ExperienceUserService,
    private readonly locationService: LocationService,
  ) {}

  async updatePreloadCache(timestamp: number) {
    const updatedAt = new Date(timestamp);

    if (isNaN(updatedAt.getTime())) {
      throw new BadRequestException();
    }

    const userFullProfiles = await this.cursusUserService.userFullProfile();

    await this.cacheUtilService.setUserFullProfiles(
      userFullProfiles,
      updatedAt,
    );

    await this.updateCursusUserRanking(
      USER_LEVEL_RANKING,
      updatedAt,
      ({ cursusUser }) => cursusUser.level,
    );

    await this.updateCursusUserRanking(
      USER_WALLET_RANKING,
      updatedAt,
      ({ cursusUser }) => cursusUser.user.wallet,
    );

    await this.updateCursusUserRanking(
      USER_CORRECTION_POINT_RANKING,
      updatedAt,
      ({ cursusUser }) => cursusUser.user.correctionPoint,
      // todo: 다른 로직 중 겹치는 부분 있으면 통합
      ({ cursusUser }) =>
        (cursusUser.grade === 'Learner' &&
          cursusUser.blackholedAt &&
          cursusUser.blackholedAt.getTime() >= new Date().getTime()) === true,
    );

    await this.updateEvalCountRanking(updatedAt, DateTemplate.TOTAL);
    await this.updateEvalCountRanking(updatedAt, DateTemplate.CURR_MONTH);
    await this.updateEvalCountRanking(updatedAt, DateTemplate.CURR_WEEK);

    await this.updateAverageReviewLength(updatedAt);

    await this.updateScoreRanking(updatedAt, DateTemplate.TOTAL);
    await this.updateScoreRanking(updatedAt, DateTemplate.CURR_MONTH);
    await this.updateScoreRanking(updatedAt, DateTemplate.CURR_WEEK);

    await this.updateTotalScoresPerCoalition(updatedAt);
    await this.updateScoreRecords(updatedAt);

    await this.updateExpIncreamentRanking(updatedAt, DateTemplate.CURR_MONTH);
    await this.updateExpIncreamentRanking(updatedAt, DateTemplate.CURR_WEEK);

    await this.updateLogtimeRanking(updatedAt, DateTemplate.TOTAL);
  }

  private async updateCursusUserRanking(
    keyBase: string,
    updatedAt: Date,
    valueExtractor: (userFullProfile: UserFullProfile) => number,
    userFilter?: (userFullProfile: UserFullProfile) => boolean,
  ): Promise<void> {
    const key = this.cacheUtilService.buildKey(
      keyBase,
      DateTemplate[DateTemplate.TOTAL],
    );

    const userFullProfileMap =
      await this.cacheUtilService.getUserFullProfileMap();

    assertExist(userFullProfileMap);

    const rankingMap: RankingCacheMap = new Map();

    [...userFullProfileMap.entries()].forEach(([userId, userFullProfile]) => {
      if (userFilter && !userFilter(userFullProfile)) {
        return;
      }

      rankingMap.set(userId, {
        ...userFullProfile,
        userPreview:
          this.cacheUtilService.extractUserPreviewFromFullProfile(
            userFullProfile,
          ),
        value: valueExtractor(userFullProfile),
        rank: -1,
      });
    });

    this.cacheUtilService.sortRankingMap(rankingMap);

    await this.cacheUtilService.setWithDate(key, rankingMap, updatedAt);
  }

  private updateEvalCountRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt: Date,
    dateTemplate: CacheSupportedDateTemplate,
  ) => {
    await this.cacheUtilService.updateRanking(
      EVAL_COUNT_RANKING,
      updatedAt,
      dateTemplate,
      (dateRange) =>
        this.scaleTeamService.evalCountRanking(
          evalCountDateRangeFilter(dateRange),
        ),
    );
  };

  private updateAverageReviewLength = async (updatedAt: Date) => {
    const comment = await this.scaleTeamService.averageReviewLength('comment');
    const feedback = await this.scaleTeamService.averageReviewLength(
      'feedback',
    );

    await this.cacheUtilService.setWithDate(
      AVERAGE_COMMENT_LENGTH,
      comment,
      updatedAt,
    );

    await this.cacheUtilService.setWithDate(
      AVERAGE_FEEDBACK_LENGTH,
      feedback,
      updatedAt,
    );
  };

  private updateScoreRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheUtilService.updateRanking(
      SCORE_RANKING,
      updatedAt,
      dateTemplate,
      (dateRange) =>
        this.scoreService.scoreRanking({
          filter: scoreDateRangeFilter(dateRange),
        }),
    );
  };

  private async updateTotalScoresPerCoalition(updatedAt: Date): Promise<void> {
    const totalScores = await this.scoreService.scoresPerCoalition();

    await this.cacheUtilService.setWithDate(
      TOTAL_SCORES_BY_COALITION,
      totalScores,
      updatedAt,
    );
  }

  private async updateScoreRecords(updatedAt: Date): Promise<void> {
    const currMonth = DateWrapper.currMonth();
    const lastYear = currMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear.toDate(),
      end: currMonth.toDate(),
    };

    const scoreRecords = await this.scoreService.scoreRecordsPerCoalition({
      filter: scoreDateRangeFilter(dateRange),
    });

    await this.cacheUtilService.setWithDate(
      SCORE_RECORDS,
      scoreRecords,
      updatedAt,
    );
  }

  private updateExpIncreamentRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheUtilService.updateRanking(
      EXP_INCREAMENT_RANKING,
      updatedAt,
      dateTemplate,
      (dateRange) =>
        this.experienceUserService.increamentRanking(
          expIncreamentDateFilter(dateRange),
        ),
    );
  };

  private updateLogtimeRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheUtilService.updateRanking(
      LOGTIME_RANKING,
      updatedAt,
      dateTemplate,
      (dateRange) => this.locationService.logtimeRanking(dateRange),
    );
  };
}
