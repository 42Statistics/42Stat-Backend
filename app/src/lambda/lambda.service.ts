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
  TOTAL_SCORES_BY_COALITION,
  WIN_COUNT_PER_COALITION,
} from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { CacheUtilRankingService } from 'src/cache/cache.util.ranking.service';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { FollowSortOrder } from 'src/follow/dto/follow.dto';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { FollowService } from 'src/follow/follow.service';

export const LAMBDA_UPDATED_AT = 'lambdaUpdatedAt';

@Injectable()
export class LambdaService {
  private isUpdating = false;

  constructor(
    private readonly cacheUtilService: CacheUtilService,
    private readonly cacheUtilRankingService: CacheUtilRankingService,
    private readonly cursusUserService: CursusUserService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scoreService: ScoreService,
    private readonly experienceUserService: ExperienceUserService,
    private readonly locationService: LocationService,
    private readonly dateRangeService: DateRangeService,
    private readonly followService: FollowService,
    private readonly followCacheService: FollowCacheService,
  ) {}

  async updatePreloadCache(timestamp: number) {
    if (this.isUpdating) {
      console.error('wrong lambda schedule');
      return;
    }

    this.isUpdating = true;

    try {
      const updatedAt = new Date(timestamp);

      if (isNaN(updatedAt.getTime())) {
        throw new BadRequestException();
      }

      const userFullProfiles = await this.cursusUserService.userFullProfile();

      await this.cacheUtilService.setUserFullProfiles(
        userFullProfiles,
        updatedAt,
      );

      userFullProfiles.map(async (userFullProfile) => {
        const followerList = await this.followService.followerListCache(
          userFullProfile.cursusUser.user.id,
          FollowSortOrder.FOLLOW_AT_DESC,
        );

        await this.followCacheService.set({
          id: userFullProfile.cursusUser.user.id,
          type: 'follower',
          list: followerList,
        });
      });

      userFullProfiles.map(async (userFullProfile) => {
        const followingList = await this.followService.followingListCache(
          userFullProfile.cursusUser.user.id,
          FollowSortOrder.FOLLOW_AT_DESC,
        );

        await this.followCacheService.set({
          id: userFullProfile.cursusUser.user.id,
          type: 'following',
          list: followingList,
        });
      });

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
      await this.updateWinCountPerCoalition(updatedAt);

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

      const totalCommentRanking =
        await this.scaleTeamService.averageReviewLengthRankingByDateRange(
          'comment',
        );

      await this.cacheUtilRankingService.setRanking(
        totalCommentRanking,
        updatedAt,
        COMMENT_RANKING,
        DateTemplate.TOTAL,
      );

      const currMonthCommentRanking =
        await this.scaleTeamService.averageReviewLengthRankingByDateRange(
          'comment',
          currMonth,
        );

      await this.cacheUtilRankingService.setRanking(
        currMonthCommentRanking,
        updatedAt,
        COMMENT_RANKING,
        DateTemplate.CURR_MONTH,
      );

      const currWeekCommentRanking =
        await this.scaleTeamService.averageReviewLengthRankingByDateRange(
          'comment',
          currWeek,
        );

      await this.cacheUtilRankingService.setRanking(
        currWeekCommentRanking,
        updatedAt,
        COMMENT_RANKING,
        DateTemplate.CURR_WEEK,
      );

      const totalLog = await this.locationService.logtimeRanking(total);

      await this.cacheUtilRankingService.setRanking(
        totalLog,
        updatedAt,
        LOGTIME_RANKING,
        DateTemplate.TOTAL,
      );
    } catch (e) {
      console.error('update lambda error', e);
    } finally {
      this.isUpdating = false;
    }
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

  private async updateWinCountPerCoalition(updatedAt: Date): Promise<void> {
    const winCountPerCoalition = await this.scoreService.winCountPerCoalition();

    await this.cacheUtilService.setWithDate(
      WIN_COUNT_PER_COALITION,
      winCountPerCoalition,
      updatedAt,
    );
  }
}
