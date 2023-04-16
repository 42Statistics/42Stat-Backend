import { Injectable } from '@nestjs/common';
import { UserRanking } from 'src/common/models/common.user.model';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { Util } from 'src/util';

@Injectable()
export class HomeService {
  constructor(private scaleTeamService: ScaleTeamsService) {}

  async currWeekEvalCnt(): Promise<number> {
    const currDate = Util.Time.currDate();
    // todo: test 용도
    currDate.setDate(-7);
    const startOfWeek = Util.Time.startOfWeek(currDate);

    return await this.scaleTeamService.getEvalCount({
      beginAt: { $gte: startOfWeek },
    });
  }

  async lastWeekEvalCnt(): Promise<number> {
    const currDate = Util.Time.currDate();

    const startOfCurrWeek = Util.Time.startOfWeek(currDate);
    const startOfLastWeek = Util.Time.startOfLastWeek(currDate);

    return await this.scaleTeamService.getEvalCount({
      beginAt: {
        $gte: startOfLastWeek,
        $lt: startOfCurrWeek,
      },
    });
  }

  async totalEvalCntRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.getEvalCountRank();
  }

  async monthlyEvalCntRank(): Promise<UserRanking[]> {
    const currDate = Util.Time.currDate();
    const startOfMonth = Util.Time.startOfMonth(currDate);

    return this.scaleTeamService.getEvalCountRank({
      beginAt: { $gte: startOfMonth },
    });
  }
}
