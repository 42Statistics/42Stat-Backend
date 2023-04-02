import { Injectable } from '@nestjs/common';
import { UserRanking } from 'src/common/models/common.user.model';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';

@Injectable()
export class HomeService {
  constructor(private scaleTeamService: ScaleTeamsService) {}

  async currWeekEvalCnt(): Promise<number> {
    return this.scaleTeamService.currWeekEvalCnt();
  }

  async lastWeekEvalCnt(): Promise<number> {
    return this.scaleTeamService.lastWeekEvalCnt();
  }

  async totalEvalCntRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.totalEvalCntRank();
  }

  async monthlyEvalCntRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.monthlyEvalCntRank();
  }
}
