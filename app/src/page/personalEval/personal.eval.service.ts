import { Injectable } from '@nestjs/common';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { Time } from 'src/util';

@Injectable()
export class PersonalEvalService {
  constructor(private scaleTeamService: ScaleTeamService) {}

  async currMonthCount(uid: number): Promise<NumberDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);

    const evalCount = await this.scaleTeamService.evalCount({
      'corrector.id': uid,
      beginAt: { $gte: currMonth },
      filledAt: { $ne: null },
    });

    return generateDateRanged(
      evalCount,
      currMonth,
      Time.moveDate(Time.moveMonth(currMonth, 1), -1),
    );
  }

  async lastMonthCount(uid: number): Promise<NumberDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const lastMonth = Time.moveMonth(currMonth, -1);

    const evalCount = await this.scaleTeamService.evalCount({
      'corrector.id': uid,
      beginAt: { $gte: lastMonth, $lt: currMonth },
      filledAt: { $ne: null },
    });

    return generateDateRanged(
      evalCount,
      lastMonth,
      Time.moveDate(currMonth, -1),
    );
  }

  async totalCount(uid: number): Promise<number> {
    return await this.scaleTeamService.evalCount({
      'corrector.id': uid,
      filledAt: { $ne: null },
    });
  }

  async averageDuration(uid: number): Promise<number> {
    return await this.scaleTeamService.averageDurationMinute({
      'corrector.id': uid,
    });
  }

  async averageFinalMark(uid: number): Promise<number> {
    return await this.scaleTeamService.averageFinalMark(uid);
  }

  async averageFeedbackLength(uid: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback', {
      'correcteds.id': uid,
    });
  }

  async averageCommentLength(uid: number): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment', {
      'corrector.id': uid,
    });
  }
}
