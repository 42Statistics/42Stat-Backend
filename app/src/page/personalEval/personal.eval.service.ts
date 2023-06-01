import { Injectable } from '@nestjs/common';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { Time } from 'src/util';

@Injectable()
export class PersonalEvalService {
  constructor(private scaleTeamService: ScaleTeamService) {}

  async currMonthCount(userId: number): Promise<NumberDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);

    const evalCount = await this.scaleTeamService.evalCount({
      'corrector.id': userId,
      beginAt: { $gte: currMonth },
      filledAt: { $ne: null },
    });

    return generateDateRanged(
      evalCount,
      currMonth,
      Time.moveDate(Time.moveMonth(currMonth, 1), -1),
    );
  }

  async lastMonthCount(userId: number): Promise<NumberDateRanged> {
    const currMonth = Time.startOfMonth(Time.curr());
    const lastMonth = Time.moveMonth(currMonth, -1);

    const evalCount = await this.scaleTeamService.evalCount({
      'corrector.id': userId,
      beginAt: { $gte: lastMonth, $lt: currMonth },
      filledAt: { $ne: null },
    });

    return generateDateRanged(evalCount, lastMonth, currMonth);
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
