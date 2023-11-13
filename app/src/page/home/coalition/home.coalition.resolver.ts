import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DailyCoalitionScoreService } from 'src/dailyCoalitionScore/dailyCoalitionScore.service';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeCoalitionService } from './home.coalition.service';
import {
  GetScoreRecordsPerCoalitionArgs,
  HomeCoalition,
  IntPerCoalition,
  IntPerCoalitionDateRanged,
  ScoreRecordPerCoalition,
} from './models/home.coalition.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeCoalition)
export class HomeCoalitionResolver {
  constructor(
    private readonly homeCoalitionService: HomeCoalitionService,
    private readonly dailyCoalitionScoreService: DailyCoalitionScoreService,
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  @Query((_of) => HomeCoalition)
  async getHomeCoalition() {
    return {};
  }

  @ResolveField((_returns) => [IntPerCoalition])
  async totalScoresPerCoalition(): Promise<IntPerCoalition[]> {
    return await this.homeCoalitionService.totalScoresPerCoalition();
  }

  @ResolveField((_returns) => [ScoreRecordPerCoalition])
  async scoreRecordsPerCoalition(
    @Args() { last }: GetScoreRecordsPerCoalitionArgs,
  ): Promise<ScoreRecordPerCoalition[]> {
    const nextMonth = DateWrapper.nextMonth().toDate();
    const start = DateWrapper.currMonth()
      .moveMonth(1 - last)
      .toDate();

    const cacheKey = `homeCoalitionScoreRecordsPerCoalition:${start.getTime()}:${nextMonth.getTime()}`;

    const cached = await this.cacheUtilService.get<ScoreRecordPerCoalition[]>(
      cacheKey,
    );

    if (cached) {
      return cached;
    }

    const result =
      await this.dailyCoalitionScoreService.scoreRecordsPerCoalitions({
        start,
        end: nextMonth,
      });

    await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

    return result;
  }

  @ResolveField((_returns) => IntPerCoalitionDateRanged)
  async tigCountPerCoalitionByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntPerCoalitionDateRanged> {
    return await this.homeCoalitionService.tigCountPerCoalitionByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField((_returns) => [IntPerCoalition])
  async winCountPerCoalition(): Promise<IntPerCoalition[]> {
    return await this.homeCoalitionService.winCountPerCoalition();
  }
}
