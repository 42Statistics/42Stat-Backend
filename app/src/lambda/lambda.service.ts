import { BadRequestException, Injectable } from '@nestjs/common';
import {
  USER_CORRECTION_POINT_RANKING,
  USER_LEVEL_RANKING,
  USER_WALLET_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
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
  CacheUtilRankingService,
  type RankingSupportedDateTemplate,
} from 'src/cache/cache.util.ranking.service';
import { CacheUtilService } from 'src/cache/cache.util.service';
import type { UserFullProfile } from 'src/common/userFullProfile';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/statDate/StatDate';

type UpdateRankingByDateTemplateFn = (
  userFullProfiles: UserFullProfile[],
  updatedAt: Date,
  dateTemplate: RankingSupportedDateTemplate,
) => Promise<void>;

export const LAMBDA_UPDATED_AT = 'lambdaUpdatedAt';

@Injectable()
export class LambdaService {
  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cacheUtilRankingService: CacheUtilRankingService,
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

    await this.cacheUtilRankingService.updateCursusUserRanking({
      userFullProfiles,
      keyBase: USER_LEVEL_RANKING,
      updatedAt,
      valueExtractor: ({ cursusUser }) => cursusUser.level,
    });

    await this.cacheUtilRankingService.updateCursusUserRanking({
      userFullProfiles,
      keyBase: USER_WALLET_RANKING,
      updatedAt,
      valueExtractor: ({ cursusUser }) => cursusUser.user.wallet,
    });

    await this.cacheUtilRankingService.updateCursusUserRanking({
      userFullProfiles,
      keyBase: USER_CORRECTION_POINT_RANKING,
      updatedAt,
      valueExtractor: ({ cursusUser }) => cursusUser.user.correctionPoint,
    });

    await this.updateEvalCountRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.TOTAL,
    );

    await this.updateEvalCountRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.CURR_MONTH,
    );

    await this.updateEvalCountRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.CURR_WEEK,
    );

    await this.updateAverageReviewLength(updatedAt);

    await this.updateScoreRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.TOTAL,
    );

    await this.updateScoreRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.CURR_MONTH,
    );

    await this.updateScoreRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.CURR_WEEK,
    );

    await this.updateTotalScoresPerCoalition(updatedAt);
    await this.updateScoreRecords(updatedAt);

    await this.updateExpIncreamentRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.CURR_MONTH,
    );

    await this.updateExpIncreamentRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.CURR_WEEK,
    );

    await this.updateLogtimeRanking(
      userFullProfiles,
      updatedAt,
      DateTemplate.TOTAL,
    );
  }

  private updateEvalCountRanking: UpdateRankingByDateTemplateFn = async (
    userFullProfiles,
    updatedAt: Date,
    dateTemplate: RankingSupportedDateTemplate,
  ) => {
    await this.cacheUtilRankingService.updateRanking({
      userFullProfiles,
      keyBase: EVAL_COUNT_RANKING,
      newUpdatedAt: updatedAt,
      dateTemplate,
      queryRankingFn: (dateRange) =>
        this.scaleTeamService.evalCountRanking(
          evalCountDateRangeFilter(dateRange),
        ),
    });
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
    userFullProfiles,
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheUtilRankingService.updateRanking({
      userFullProfiles,
      keyBase: SCORE_RANKING,
      newUpdatedAt: updatedAt,
      dateTemplate,
      queryRankingFn: (dateRange) =>
        this.scoreService.scoreRanking({
          filter: scoreDateRangeFilter(dateRange),
        }),
    });
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
    userFullProfiles,
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheUtilRankingService.updateRanking({
      userFullProfiles,
      keyBase: EXP_INCREAMENT_RANKING,
      newUpdatedAt: updatedAt,
      dateTemplate,
      queryRankingFn: (dateRange) =>
        this.experienceUserService.increamentRanking(
          expIncreamentDateFilter(dateRange),
        ),
    });
  };

  private updateLogtimeRanking: UpdateRankingByDateTemplateFn = async (
    userFullProfiles,
    updatedAt,
    dateTemplate,
  ) => {
    await this.cacheUtilRankingService.updateRanking({
      userFullProfiles,
      keyBase: LOGTIME_RANKING,
      newUpdatedAt: updatedAt,
      dateTemplate,
      queryRankingFn: (dateRange) =>
        this.locationService.logtimeRanking(dateRange),
    });
  };
}
