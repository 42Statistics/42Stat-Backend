import { Injectable } from '@nestjs/common';
import {
  AVERAGE_COMMENT_LENGTH,
  AVERAGE_FEEDBACK_LENGTH,
  ScaleTeamCacheService,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';

@Injectable()
export class HomeEvalService {
  constructor(
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
  ) {}

  @CacheOnReturn()
  async totalEvalCount(): Promise<number> {
    return await this.scaleTeamService.evalCount();
  }

  async averageFeedbackLength(): Promise<number> {
    const cachedLength =
      await this.scaleTeamCacheService.getAverageReviewLength(
        AVERAGE_FEEDBACK_LENGTH,
      );

    return (
      cachedLength ??
      (await this.scaleTeamService.averageReviewLength('feedback'))
    );
  }

  async averageCommentLength(): Promise<number> {
    const cachedLength =
      await this.scaleTeamCacheService.getAverageReviewLength(
        AVERAGE_COMMENT_LENGTH,
      );

    return (
      cachedLength ??
      (await this.scaleTeamService.averageReviewLength('comment'))
    );
  }
}
