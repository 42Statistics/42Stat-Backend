import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DailyTeamCloseCountService } from 'src/dailyTeamCloseCount/dailyTeamCloseCount.service';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { RecentExamResultArgs } from './dtos/home.team.dto.recentExamResultArgs';
import { HomeTeamService } from './home.team.service';
import {
  ExamResult,
  ExamResultDateRanged,
  GetHomeTeamCloseRecordsArgs,
  HomeTeam,
  ProjectRank,
} from './models/home.team.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeTeam)
export class HomeTeamResolver {
  constructor(
    private readonly homeTeamService: HomeTeamService,
    private readonly dailyTeamCloseCountService: DailyTeamCloseCountService,
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  @Query((_of) => HomeTeam)
  async getHomeTeam() {
    return {};
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 730 일' })
  async teamCloseRecords(
    @Args() { last }: GetHomeTeamCloseRecordsArgs,
  ): Promise<IntRecord[]> {
    const nextDay = new DateWrapper().startOfDate().moveDate(1).toDate();
    const start = new DateWrapper()
      .startOfDate()
      .moveDate(1 - last)
      .toDate();

    const cacheKey = `homeTeamCloseRecords:${start.getTime()}:${nextDay.getTime()}`;
    const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.dailyTeamCloseCountService.teamCloseCountRecords({
      start,
      end: nextDay,
    });

    await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

    return result;
  }

  @ResolveField((_returns) => [ProjectRank])
  async currRegisteredCountRanking(
    @Args('limit', { defaultValue: 3 }) limit: number,
  ): Promise<ProjectRank[]> {
    return await this.homeTeamService.currRegisteredCountRanking(limit);
  }

  @ResolveField((_returns) => ExamResult)
  async recentExamResult(
    @Args() { skip }: RecentExamResultArgs,
  ): Promise<ExamResultDateRanged> {
    return await this.homeTeamService.recentExamResult(skip);
  }
}
