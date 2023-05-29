import { Injectable } from '@nestjs/common';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { UserRanking } from 'src/common/models/common.user.model';
import { Time } from 'src/util';

@Injectable()
export class LeaderboardEvalService {
  constructor(private scaleTeamService: ScaleTeamService) {}

  async totalEvalCountRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.getEvalCountRank();
  }

  async evalCountRank(start: Date, end: Date): Promise<UserRanking[]> {
    const evalCountRank = await this.scaleTeamService.getEvalCountRank({
      beginAt: { $gte: start, $lt: end },
      filledAt: { $ne: null },
    });

    return evalCountRank;
  }
}
