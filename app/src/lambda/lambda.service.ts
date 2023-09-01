import { BadRequestException, Injectable } from '@nestjs/common';
import {
  USER_CORRECTION_POINT_RANKING,
  USER_LEVEL_RANKING,
  USER_WALLET_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import {
  CursusUserService,
  isBlackholed,
} from 'src/api/cursusUser/cursusUser.service';
import { expIncreamentDateFilter } from 'src/api/experienceUser/db/experiecneUser.database.aggregate';
import { EXP_INCREAMENT_RANKING } from 'src/api/experienceUser/experienceUser.cache.service';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { LOGTIME_RANKING } from 'src/api/location/location.cache.service';
import { LocationService } from 'src/api/location/location.service';
import { evalCountDateRangeFilter } from 'src/api/scaleTeam/db/scaleTeam.database.aggregate';
import {
  AVERAGE_COMMENT_LENGTH,
  AVERAGE_FEEDBACK_LENGTH,
  COMMENT_RANKING,
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
import { CacheUtilRankingService } from 'src/cache/cache.util.ranking.service';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';

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
    private readonly dateRangeService: DateRangeService,
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
      userFilter: ({ cursusUser }) => isBlackholed(cursusUser),
    });

    const total = this.dateRangeService.dateRangeFromTemplate(
      DateTemplate.TOTAL,
    );

    const currWeek = this.dateRangeService.dateRangeFromTemplate(
      DateTemplate.CURR_WEEK,
    );

    const currMonth = this.dateRangeService.dateRangeFromTemplate(
      DateTemplate.CURR_MONTH,
    );

    const totalEval = await this.scaleTeamService.evalCountRanking(
      evalCountDateRangeFilter(total),
    );

    await this.cacheUtilRankingService.setRanking(
      totalEval,
      updatedAt,
      EVAL_COUNT_RANKING,
      DateTemplate.TOTAL,
    );

    const currMonthEval = await this.scaleTeamService.evalCountRanking(
      evalCountDateRangeFilter(currMonth),
    );

    await this.cacheUtilRankingService.setRanking(
      currMonthEval,
      updatedAt,
      EVAL_COUNT_RANKING,
      DateTemplate.CURR_MONTH,
    );

    const currWeekEval = await this.scaleTeamService.evalCountRanking(
      evalCountDateRangeFilter(currWeek),
    );

    await this.cacheUtilRankingService.setRanking(
      currWeekEval,
      updatedAt,
      EVAL_COUNT_RANKING,
      DateTemplate.CURR_WEEK,
    );

    await this.updateAverageReviewLength(updatedAt);

    const totalScore = await this.scoreService.scoreRanking({
      filter: scoreDateRangeFilter(total),
    });

    await this.cacheUtilRankingService.setRanking(
      totalScore,
      updatedAt,
      SCORE_RANKING,
      DateTemplate.TOTAL,
    );

    const currMonthScore = await this.scoreService.scoreRanking({
      filter: scoreDateRangeFilter(currMonth),
    });

    await this.cacheUtilRankingService.setRanking(
      currMonthScore,
      updatedAt,
      SCORE_RANKING,
      DateTemplate.CURR_MONTH,
    );

    const currWeekScore = await this.scoreService.scoreRanking({
      filter: scoreDateRangeFilter(currWeek),
    });

    await this.cacheUtilRankingService.setRanking(
      currWeekScore,
      updatedAt,
      SCORE_RANKING,
      DateTemplate.CURR_WEEK,
    );

    await this.updateTotalScoresPerCoalition(updatedAt);
    await this.updateScoreRecords(updatedAt);

    const currMonthExp = await this.experienceUserService.increamentRanking(
      expIncreamentDateFilter(currMonth),
    );

    await this.cacheUtilRankingService.setRanking(
      currMonthExp,
      updatedAt,
      EXP_INCREAMENT_RANKING,
      DateTemplate.CURR_MONTH,
    );

    const currWeekExp = await this.experienceUserService.increamentRanking(
      expIncreamentDateFilter(currWeek),
    );

    await this.cacheUtilRankingService.setRanking(
      currWeekExp,
      updatedAt,
      EXP_INCREAMENT_RANKING,
      DateTemplate.CURR_WEEK,
    );

    const commentRank = await this.scaleTeamService.averageReviewLengthRanking(
      'comment',
    );

    await this.cacheUtilRankingService.setRanking(
      commentRank,
      updatedAt,
      COMMENT_RANKING,
      DateTemplate.TOTAL,
    );

    const totalLog = await this.locationService.logtimeRanking(total);

    await this.cacheUtilRankingService.setRanking(
      totalLog,
      updatedAt,
      LOGTIME_RANKING,
      DateTemplate.TOTAL,
    );
  }

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

  private async updateTotalScoresPerCoalition(updatedAt: Date): Promise<void> {
    const totalScores = await this.scoreService.scoresPerCoalition();

    await this.cacheUtilService.setWithDate(
      TOTAL_SCORES_BY_COALITION,
      totalScores,
      updatedAt,
    );
  }

  private async updateScoreRecords(updatedAt: Date): Promise<void> {
    const nextMonth = DateWrapper.currMonth().moveMonth(1);
    const lastYear = nextMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear.toDate(),
      end: nextMonth.toDate(),
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
}
