import { Injectable } from '@nestjs/common';
import { CoalitionsUserService } from 'src/coalitionsUser/coalitionsUser.service';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
import { CursusUserService } from 'src/cursusUser/cursusUser.service';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { QuestsUserService } from 'src/questsUser/questsUser.service';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import {
  CoalitionScore,
  CoalitionScoreRecords,
} from 'src/score/models/score.coalition.model';
import { ScoreService } from 'src/score/score.service';
import { Time } from 'src/util';
import {
  UserCountPerLevels,
  ValuePerCircle,
  ValueRecord,
} from './models/total.model';

@Injectable()
export class TotalService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private scoreService: ScoreService,
    private cursusUserService: CursusUserService,
    private questsUserService: QuestsUserService,
    private coalitionsUserService: CoalitionsUserService,
  ) {}

  async totalScores(): Promise<CoalitionScore[]> {
    return await this.scoreService.getScoresByCoalition();
  }

  async scoreRecords(): Promise<CoalitionScoreRecords[]> {
    // todo: 고정 코알리숑 아이디
    const coalitionIds = [85, 86, 87, 88];

    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const lastYear = Time.startOfMonth(Time.moveMonth(currDate, -12));

    return await this.scoreService.getScoreRecords({
      createdAt: { $gte: lastYear, $lt: currMonth },
      coalitionsUserId: { $ne: null },
      coalitionId: { $in: coalitionIds },
    });
  }

  async monthlyScoreRanks(): Promise<UserRankingDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const nextMonth = Time.moveMonth(currMonth, 1);

    const scoreRanks = await this.coalitionsUserService.getScoreRank(
      currMonth,
      nextMonth,
      3,
    );

    return generateDateRanged(
      scoreRanks,
      currMonth,
      Time.moveDate(nextMonth, -1),
    );
  }

  async totalEvalCount(): Promise<number> {
    return await this.scaleTeamService.getEvalCount();
  }

  async averageFeedbackLength(): Promise<number> {
    return await this.scaleTeamService.getAverageReviewLength('feedback');
  }

  async averageCommentLength(): Promise<number> {
    return await this.scaleTeamService.getAverageReviewLength('comment');
  }

  async userCountPerLevels(): Promise<UserCountPerLevels[]> {
    return await this.cursusUserService.getUserCountPerLevels();
  }

  //todo: 151069 유저 제거필요
  async walletRanks(): Promise<UserRanking[]> {
    return await this.cursusUserService.getRank('user.wallet');
  }

  async correctionPointRanks(): Promise<UserRanking[]> {
    return await this.cursusUserService.getRank('user.correctionPoint');
  }

  async averageCircleDurations(): Promise<ValuePerCircle[]> {
    return await this.questsUserService.getAverageCircleDurations();
  }

  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.cursusUserService.getBlackholedCountPerCircles();
  }

  async activeUserCountRecords(start: Date, end: Date): Promise<ValueRecord[]> {
    const newPromoCounts = await this.cursusUserService.countPerMonth(
      start,
      end,
      'beginAt',
    );

    const blackholedCounts = await this.cursusUserService.countPerMonth(
      start,
      end,
      'blackholedAt',
    );

    let activeUserCount = 0;

    const dates = Time.partitionByMonth(start, end);

    return dates.map((date): ValueRecord => {
      const newPromo = Time.getCountByDate(date, newPromoCounts);
      const blackholed = Time.getCountByDate(date, blackholedCounts);

      activeUserCount += newPromo - blackholed;

      return {
        at: date,
        value: activeUserCount,
      };
    });
  }

  //async averageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  return await this.questsUserService.getAverageCircleDurationsByPromo();
  //}
}
