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
  EVAL_COUNT_RANKING,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import {
  scoreDateRangeFilter,
  scoreRecordsFilter,
} from 'src/api/score/db/score.database.aggregate';
import {
  SCORE_RANKING,
  SCORE_RECORDS,
  TOTAL_SCORES_BY_COALITION,
} from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import {
  CacheSupportedDateTemplate,
  CacheUtilService,
  RankingCacheMap,
} from 'src/cache/cache.util.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';

type UpdateRankingByDateTemplateFn = (
  updatedAt: Date,
  dateTemplate: CacheSupportedDateTemplate,
) => Promise<void>;

export const LAMBDA_UPDATED_AT = 'lambdaUpdatedAt';

@Injectable()
export class LambdaService {
  constructor(
    private cacheTempService: CacheUtilService,
    private cursusUserService: CursusUserService,
    private scaleTeamService: ScaleTeamService,
    private scoreService: ScoreService,
    private experienceUserService: ExperienceUserService,
    private locationService: LocationService,
  ) {}

  async updatePreloadCache(timestamp: number) {
    const updatedAt = new StatDate(timestamp);

    if (isNaN(updatedAt.getTime())) {
      throw new BadRequestException();
    }

    const userFullProfiles = await this.cursusUserService.userFullProfile();

    await this.cacheTempService.setUserFullProfiles(
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
  ): Promise<void> {
    const key = this.cacheTempService.buildKey(
      keyBase,
      DateTemplate[DateTemplate.TOTAL],
    );

    const userFullProfileMap =
      await this.cacheTempService.getUserFullProfileMap();

    assertExist(userFullProfileMap);

    const rankingMap: RankingCacheMap = new Map();

    [...userFullProfileMap.entries()].forEach(([userId, userFullProfile]) => {
      rankingMap.set(userId, {
        ...userFullProfile,
        userPreview:
          this.cacheTempService.extractUserPreviewFromFullProfile(
            userFullProfile,
          ),
        value: valueExtractor(userFullProfile),
        rank: -1,
      });
    });

    this.cacheTempService.sortRankingMap(rankingMap);

    await this.cacheTempService.setWithDate(key, rankingMap, updatedAt);
  }

  private updateEvalCountRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt: Date,
    dateTemplate: CacheSupportedDateTemplate,
  ) => {
    await this.cacheTempService.updateRanking(
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

    await this.cacheTempService.setWithDate(
      AVERAGE_COMMENT_LENGTH,
      comment,
      updatedAt,
    );

    await this.cacheTempService.setWithDate(
      AVERAGE_COMMENT_LENGTH,
      feedback,
      updatedAt,
    );
  };

  private updateScoreRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheTempService.updateRanking(
      SCORE_RANKING,
      updatedAt,
      dateTemplate,
      (dateRange) =>
        this.scoreService.scoreRanking(scoreDateRangeFilter(dateRange)),
    );
  };

  private async updateTotalScoresPerCoalition(updatedAt: Date): Promise<void> {
    const totalScores = await this.scoreService.scoresPerCoalition();

    await this.cacheTempService.setWithDate(
      TOTAL_SCORES_BY_COALITION,
      totalScores,
      updatedAt,
    );
  }

  private async updateScoreRecords(updatedAt: Date): Promise<void> {
    const currMonth = StatDate.currMonth();
    const lastYear = currMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear,
      end: currMonth,
    };

    const scoreRecords = await this.scoreService.scoreRecordsPerCoalition(
      scoreRecordsFilter(dateRange),
    );

    await this.cacheTempService.setWithDate(
      SCORE_RECORDS,
      scoreRecords,
      updatedAt,
    );
  }

  private updateExpIncreamentRanking: UpdateRankingByDateTemplateFn = async (
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheTempService.updateRanking(
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
    await this.cacheTempService.updateRanking(
      LOGTIME_RANKING,
      updatedAt,
      dateTemplate,
      (dateRange) => this.locationService.logtimeRanking(dateRange),
    );
  };
}
