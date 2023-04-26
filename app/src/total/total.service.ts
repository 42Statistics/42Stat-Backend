import { Injectable } from '@nestjs/common';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import {
  CoalitionScore,
  CoalitionScoreRecords,
} from 'src/score/models/score.coalition.model';
import { ScoreService } from 'src/score/score.service';
import { Time } from 'src/util';

@Injectable()
export class TotalService {
  constructor(
    private scaleTeamService: ScaleTeamsService,
    private scoreService: ScoreService,
  ) {}

  async totalScores(): Promise<CoalitionScore[]> {
    return await this.scoreService.getScoresByCoalition();
  }

  async scoreRecords(): Promise<CoalitionScoreRecords[]> {
    // todo
    const coalitionIds = [85, 86, 87, 88];

    const currDate = Time.curr();
    const lastYear = Time.startOfMonth(Time.moveMonth(currDate, -11));

    return await this.scoreService.getScoreRecords(
      lastYear,
      currDate,
      coalitionIds,
    );
  }

  async monthlyScoreRanks(): Promise<UserRankingDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const nextMonth = Time.moveMonth(currMonth, 1);

    const scoreRanks = await this.scoreService.getScoreRanks(
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
}
