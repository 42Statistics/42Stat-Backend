import { Injectable } from '@nestjs/common';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { Time } from 'src/util';

@Injectable()
export class TotalService {
  constructor(private coalitionsUserService: CoalitionsUserService) {}

  async monthlyScoreRanks(): Promise<UserRankingDateRanged> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const nextMonth = Time.moveMonth(currMonth, 1);

    const scoreRanks = await this.coalitionsUserService.getScoreRank(
      currMonth,
      nextMonth,
      3,
    );

    return generateDateRanged(
      scoreRanks,
      currMonth,
      Time.moveDate(nextMonth, -1),
    );
  }
}
