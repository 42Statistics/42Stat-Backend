import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';

@Injectable()
export class TotalService {
  constructor(private scaleTeamService: ScaleTeamsService) {}
  async totalEvalCnt(): Promise<number> {
    return this.scaleTeamService.totalEvalCnt();
  }

  async averageFeedbackLength(): Promise<number> {
    return this.scaleTeamService.averageFeedbackLength();
  }
}
