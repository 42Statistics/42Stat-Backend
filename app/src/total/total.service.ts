import { Injectable } from '@nestjs/common';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';

@Injectable()
export class TotalService {
  constructor(private scaleTeamService: ScaleTeamsService) {}
  async totalEvalCnt(): Promise<number> {
    return await this.scaleTeamService.getEvalCnt();
  }

  async averageFeedbackLength(): Promise<number> {
    return await this.scaleTeamService.getAverageReviewLength('feedback');
  }
}
