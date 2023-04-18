import { Injectable } from '@nestjs/common';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { ScoreService } from 'src/score/score.service';
import { ScoreRecords, TotalScore } from './models/total.model';
import { Util } from 'src/util';
import { UserRanking } from 'src/common/models/common.user.model';

@Injectable()
export class TotalService {
  constructor(
    private scaleTeamService: ScaleTeamsService,
    private scoreService: ScoreService,
  ) {}

  // todo: coalition module 분리
  async totalScores(): Promise<TotalScore[]> {
    const coalitionScores = await this.scoreService.getScoresByCoalition();

    return coalitionScores.map(
      ({ coalitionId, value }): TotalScore => ({
        coalition: {
          id: coalitionId,
          name: coalitionId,
        },
        score: value,
      }),
    );
  }

  async scoreRecords(): Promise<ScoreRecords[]> {
    // todo
    const coalitionIds = [85, 86, 87, 88];

    // todo: time
    const currDate = Util.Time.currDate();
    const beforeOneYear = Util.Time.startOfMonth(currDate);
    beforeOneYear.setMonth(currDate.getMonth() - 12);

    const scores = await this.scoreService.getScoreRecords(
      beforeOneYear,
      currDate,
      coalitionIds,
    );

    return scores.map(({ coalitionId, records }) => ({
      coalition: {
        id: coalitionId,
        name: coalitionId,
      },
      records: records,
    }));
  }

  async monthlyScoreRanks(): Promise<UserRanking[]> {
    const currDate = Util.Time.currDate();
    const startOfMonth = Util.Time.startOfMonth(currDate);
    // todo: time
    const lastOfMonth = new Date(startOfMonth);
    lastOfMonth.setMonth(1 + startOfMonth.getMonth());

    return await this.scoreService.getScoreRanks(startOfMonth, lastOfMonth, 3);
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
