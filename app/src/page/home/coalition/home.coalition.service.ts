import { Injectable } from '@nestjs/common';
import { SEOUL_COALITION_ID } from 'src/api/coalition/coalition.service';
import { scoreRecordsFilter } from 'src/api/score/db/score.database.aggregate';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type {
  IntPerCoalition,
  IntPerCoalitionDateRanged,
  ScoreRecordPerCoalition,
} from './models/home.coalition.model';

@Injectable()
export class HomeCoalitionService {
  constructor(
    private scoreService: ScoreService,
    private scoreCacheService: ScoreCacheService,
    private dateRangeService: DateRangeService,
  ) {}

  async totalScoresPerCoalition(): Promise<IntPerCoalition[]> {
    const cachedTotalScores =
      await this.scoreCacheService.getTotalScoresPerCoalition();

    return cachedTotalScores ?? (await this.scoreService.scoresPerCoalition());
  }

  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    const cachedScoreRecords = await this.scoreCacheService.getScoreRecords();

    const currMonth = new StatDate().startOfMonth();
    const lastYear = currMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear,
      end: currMonth,
    };

    return (
      cachedScoreRecords ??
      (await this.scoreService.scoreRecordsPerCoalition(
        scoreRecordsFilter(dateRange),
      ))
    );
  }

  @CacheOnReturn()
  async tigCountPerCoalitionByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<IntPerCoalitionDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    const dateFilter = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const tigCountPerCoalition = await this.scoreService.tigCountPerCoalition(
      SEOUL_COALITION_ID,
      dateFilter,
    );

    return this.dateRangeService.toDateRanged(tigCountPerCoalition, dateRange);
  }
}
