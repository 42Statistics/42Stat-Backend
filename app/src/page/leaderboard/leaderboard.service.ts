import { Injectable } from '@nestjs/common';
import type { UserRanking } from 'src/common/models/common.user.model';
import { DateRangeArgs, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { Time } from 'src/util';
import type { LeaderboardElement } from './models/leaderboard.model';

@Injectable()
export class LeaderboardService {
  dateRangeFromTemplate(dateTemplate: DateTemplate): DateRangeArgs {
    const curr = Time.curr();

    switch (dateTemplate) {
      case DateTemplate.WEEKLY:
        return {
          start: Time.startOfWeek(curr),
          end: Time.moveWeek(Time.startOfWeek(curr), 1),
        };
      case DateTemplate.MONTHLY:
        return {
          start: Time.startOfMonth(curr),
          end: Time.moveMonth(Time.startOfMonth(curr), 1),
        };
    }
  }

  userRankingToLeaderboardElement(
    userId: number,
    userRanking: UserRanking[],
  ): LeaderboardElement {
    return {
      me: userRanking.find(({ userPreview }) => userPreview.id === userId),
      totalRanks: userRanking,
    };
  }
}
