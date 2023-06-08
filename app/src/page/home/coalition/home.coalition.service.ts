import { Injectable } from '@nestjs/common';
import { SEOUL_COALITION_ID } from 'src/api/coalition/coalition.service';
import { ScoreService } from 'src/api/score/score.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type {
  IntPerCoalition,
  ScoreRecordPerCoalition,
} from './models/home.coalition.model';

@Injectable()
export class HomeCoalitionService {
  constructor(
    private scoreService: ScoreService,
    private dateRangeService: DateRangeService,
  ) {}

  async totalScoresPerCoalition(): Promise<IntPerCoalition[]> {
    return await this.scoreService.scoresPerCoalition();
  }

  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    const currMonth = new StatDate().startOfMonth();
    const lastYear = currMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear,
      end: currMonth,
    };

    return await this.scoreService.scoreRecordsPerCoalition({
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      coalitionsUserId: { $ne: null },
      coalitionId: { $in: SEOUL_COALITION_ID },
    });
  }

  async tigCountPerCoalitions(): Promise<IntPerCoalition[]> {
    const currMonth = new StatDate().startOfMonth();
    const nextMonth = currMonth.moveMonth(1);

    const dateFilter = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange({
        start: currMonth,
        end: nextMonth,
      }),
    };

    return await this.scoreService.tigCountPerCoalition(
      SEOUL_COALITION_ID,
      dateFilter,
    );
  }
}
