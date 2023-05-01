import { Injectable } from '@nestjs/common';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
import { CursusUserService } from 'src/cursus_user/cursusUser.service';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { ScaleTeamService } from 'src/scaleTeam/scaleTeam.service';
import { Time } from 'src/util';

@Injectable()
export class HomeService {
  constructor(
    private scaleTeamService: ScaleTeamService,
    private cursusUserService: CursusUserService,
  ) {}

  async currWeekEvalCount(): Promise<NumberDateRanged> {
    const currDate = Time.curr();
    const currWeek = Time.startOfWeek(currDate);
    const nextWeek = Time.moveWeek(currWeek, 1);

    const evalCount = await this.scaleTeamService.getEvalCount({
      beginAt: { $gte: currWeek, $lt: nextWeek },
      filledAt: { $ne: null },
    });

    return generateDateRanged(evalCount, currWeek, Time.moveDate(nextWeek, -1));
  }

  async lastWeekEvalCount(): Promise<NumberDateRanged> {
    const currDate = Time.curr();
    const currWeek = Time.startOfWeek(currDate);
    const lastWeek = Time.moveWeek(currWeek, -1);

    const evalCount = await this.scaleTeamService.getEvalCount({
      beginAt: { $gte: lastWeek, $lt: currWeek },
      filledAt: { $ne: null },
    });

    return generateDateRanged(evalCount, lastWeek, Time.moveDate(currWeek, -1));
  }

  async totalEvalCountRank(): Promise<UserRanking[]> {
    return this.scaleTeamService.getEvalCountRank();
  }

  async monthlyEvalCountRank(): Promise<UserRankingDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const nextMonth = Time.moveMonth(currMonth, 1);

    const evalCountRank = await this.scaleTeamService.getEvalCountRank({
      beginAt: { $gte: currMonth, $lt: nextMonth },
      filledAt: { $ne: null },
    });

    return generateDateRanged(
      evalCountRank,
      currMonth,
      Time.moveDate(nextMonth, -1),
    );
  }

  async levelRank(): Promise<UserRanking[]> {
    return await this.cursusUserService.getRank('level');
  }

  async lastMonthblackholedCount(): Promise<NumberDateRanged> {
    const lastMonth = Time.moveMonth(Time.curr(), -1);
    const start = Time.startOfMonth(lastMonth);
    const end = Time.moveMs(Time.moveMonth(start, 1), -1);

    const blackholedCount = await this.cursusUserService.countPerMonth(
      start,
      end,
      'blackholedAt',
    );

    return generateDateRanged(blackholedCount[0].value, start, end);
  }

  async currMonthblackholedCount(): Promise<NumberDateRanged> {
    const curr = Time.curr();
    const start = Time.startOfMonth(curr);
    const end = Time.moveMs(Time.moveMonth(start, 1), -1);

    const blackholedCount = await this.cursusUserService.countPerMonth(
      start,
      end,
      'blackholedAt',
    );

    return generateDateRanged(blackholedCount[0].value, start, end);
  }
}
