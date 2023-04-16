import { Injectable } from '@nestjs/common';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';

@Injectable()
export class TotalService {
  constructor(private scaleTeamService: ScaleTeamsService) {}
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
