import { Injectable } from '@nestjs/common';
import { scoreDateRangeFilter } from 'src/api/score/db/score.database.aggregate';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { assertExist } from 'src/common/assertExist';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
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

    const scoreRecords =
      cachedScoreRecords ??
      (await this.scoreService.scoreRecordsPerCoalition({
        filter: scoreDateRangeFilter(dateRange),
      }));

    const dates: Date[] = [];

    for (
      let currMonth = lastYear;
      currMonth.toDate() < nextMonth.toDate();
      currMonth = currMonth.moveMonth(1)
    ) {
      dates.push(currMonth.toDate());
    }

    return scoreRecords.map(({ coalition, records }) => {
      const zeroFilledRecords = dates.reduce((newRecords, currDate) => {
        const currValue = records.find(
          ({ at }) => currDate.getTime() === at.getTime(),
        )?.value;

        newRecords.push({ at: currDate, value: currValue ?? 0 });

        return newRecords;
      }, new Array<IntRecord>());

      return {
        coalition,
        records: zeroFilledRecords,
      };
    });
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

  async winCountPerCoalition(): Promise<IntPerCoalition[]> {
    const cached = await this.scoreCacheService.getWinCountPerCoalition();
    assertExist(cached);

    return cached;
  }
}
