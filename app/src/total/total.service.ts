import { Injectable } from '@nestjs/common';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { ScoreService } from 'src/score/score.service';
import { Time } from 'src/util';
import { ScoreRecords, TotalScore } from './models/total.model';

@Injectable()
export class TotalService {
  constructor(
    private scaleTeamService: ScaleTeamsService,
    private scoreService: ScoreService,
    private questUserService: QuestsUserService,
  ) {}

  // todo: coalition module 분리
  async totalScores(): Promise<TotalScore[]> {
    const coalitionScores = await this.scoreService.getScoresByCoalition();

    return coalitionScores.map(
      ({ coalitionId, value }): TotalScore => ({
        coalition: { id: coalitionId, name: coalitionId },
        score: value,
      }),
    );
  }

  async scoreRecords(): Promise<ScoreRecords[]> {
    // todo
    const coalitionIds = [85, 86, 87, 88];

    const currDate = Time.curr();
    const lastYear = Time.startOfMonth(Time.moveMonth(currDate, -11));

    const scores = await this.scoreService.getScoreRecords(
      lastYear,
      currDate,
      coalitionIds,
    );

    return scores.map(({ coalitionId, records }) => ({
      coalition: { id: coalitionId, name: coalitionId },
      records: records,
    }));
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

  async averageCircleDurations(): Promise<ValuePerCircle[]> {
    return await this.questUserService.getAverageCircleDurations();
  }
}
