import { Injectable } from '@nestjs/common';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import {
  dateRangeFromTemplate,
  generateDateRanged,
} from 'src/dateRange/dateRange.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class PersonalEvalService {
  constructor(private scaleTeamService: ScaleTeamService) {}

  async currMonthCount(userId: number): Promise<NumberDateRanged> {
    const dateRange = dateRangeFromTemplate(DateTemplate.CURR_MONTH);

    const evalCount = await this.scaleTeamService.evalCount({
      'corrector.id': userId,
      beginAt: { $gte: dateRange.start },
      filledAt: { $ne: null },
    });

    return generateDateRanged(evalCount, dateRange);
  }

  async lastMonthCount(userId: number): Promise<NumberDateRanged> {
    const dateRange = dateRangeFromTemplate(DateTemplate.LAST_MONTH);

    const evalCount = await this.scaleTeamService.evalCount({
      'corrector.id': userId,
      beginAt: { $gte: dateRange.start, $lt: dateRange.end },
      filledAt: { $ne: null },
    });

    return generateDateRanged(evalCount, dateRange);
  }

  async totalCount(userId: number): Promise<number> {
    return await this.scaleTeamService.evalCount({
      'corrector.id': userId,
      filledAt: { $ne: null },
    });
  }

  async averageDuration(userId: number): Promise<number> {
    return await this.scaleTeamService.averageDurationMinute({
      'corrector.id': userId,
    });
  }

  async averageFinalMark(userId: number): Promise<number> {
    return await this.scaleTeamService.averageFinalMark(userId);
  }

  async averageFeedbackLength(userId: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback', {
      'correcteds.id': userId,
    });
  }

  async averageCommentLength(userId: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment', {
      'corrector.id': userId,
    });
  }
}
