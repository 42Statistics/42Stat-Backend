import { Injectable } from '@nestjs/common';
import { scoreDateRangeFilter } from 'src/api/score/db/score.database.aggregate';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { assertExist } from 'src/common/assertExist';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type {
  IntPerCoalition,
  IntPerCoalitionDateRanged,
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
