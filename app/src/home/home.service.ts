import { Injectable } from '@nestjs/common';
import { UserRanking } from 'src/common/models/common.user.model';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { Time } from 'src/util';

@Injectable()
export class HomeService {
  constructor(private scaleTeamService: ScaleTeamsService) {}

  async currWeekEvalCnt(): Promise<number> {
    const currDate = Time.curr();
    const currWeek = Time.startOfWeek(currDate);
    const nextWeek = Time.moveWeek(currWeek, 1);

    return await this.scaleTeamService.getEvalCount({
      beginAt: { $gte: currWeek, $lt: nextWeek },
      filledAt: { $ne: null },
    });
  }

  async lastWeekEvalCnt(): Promise<number> {
    const currDate = Time.curr();
    const currWeek = Time.startOfWeek(currDate);
    const lastWeek = Time.moveWeek(currWeek, -1);

    return await this.scaleTeamService.getEvalCount({
      beginAt: { $gte: lastWeek, $lt: currWeek },
      filledAt: { $ne: null },
    });
  }

  async totalEvalCntRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.getEvalCountRank();
  }

  async monthlyEvalCntRank(): Promise<UserRanking[]> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const nextMonth = Time.moveMonth(currMonth, 1);

    return this.scaleTeamService.getEvalCountRank({
      beginAt: { $gte: currMonth, $lt: nextMonth },
      filledAt: { $ne: null },
    });
  }
}
