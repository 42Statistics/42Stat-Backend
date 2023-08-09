import { Injectable } from '@nestjs/common';
import { scoreDateRangeFilter } from 'src/api/score/db/score.database.aggregate';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type {
  IntPerCoalition,
  IntPerCoalitionDateRanged,
  ScoreRecordPerCoalition,
} from './models/home.coalition.model';

@Injectable()
export class HomeCoalitionService {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly scoreCacheService: ScoreCacheService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  async totalScoresPerCoalition(): Promise<IntPerCoalition[]> {
    const cachedTotalScores =
      await this.scoreCacheService.getTotalScoresPerCoalition();

    return cachedTotalScores ?? (await this.scoreService.scoresPerCoalition());
  }

  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    const cachedScoreRecords = await this.scoreCacheService.getScoreRecords();

    const nextMonth = new DateWrapper().startOfMonth().moveMonth(1);
    const lastYear = nextMonth.moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear.toDate(),
      end: nextMonth.toDate(),
    };

    return (
      cachedScoreRecords ??
      (await this.scoreService.scoreRecordsPerCoalition({
        filter: scoreDateRangeFilter(dateRange),
      }))
    );
  }

  @CacheOnReturn()
  async tigCountPerCoalitionByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<IntPerCoalitionDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    const tigCountPerCoalition = await this.scoreService.tigCountPerCoalition({
      filter: scoreDateRangeFilter(dateRange),
    });

    return this.dateRangeService.toDateRanged(tigCountPerCoalition, dateRange);
  }
}
