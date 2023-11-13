import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DailyEvalCountService } from 'src/dailyEvalCount/dailyEvalCount.service';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeEvalService } from './home.eval.service';
import { GetEvalCountRecordsArgs, HomeEval } from './models/home.eval.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeEval)
export class HomeEvalResolver {
  constructor(
    private readonly homeEvalService: HomeEvalService,
    private readonly dailyEvalCountService: DailyEvalCountService,
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  @Query((_of) => HomeEval)
  async getHomeEval() {
    return {};
  }

  @ResolveField((_returns) => Int)
  async totalEvalCount(): Promise<number> {
    return await this.homeEvalService.totalEvalCount();
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 730 일' })
  async evalCountRecords(
    @Args() { last }: GetEvalCountRecordsArgs,
  ): Promise<IntRecord[]> {
    const nextDay = new DateWrapper().startOfDate().moveDate(1).toDate();
    const start = new DateWrapper()
      .startOfDate()
      .moveDate(1 - last)
      .toDate();

    const cacheKey = `evalCountRecords:${start.getTime()}:${nextDay.getTime()}`;

    const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.dailyEvalCountService.evalCountRecordsByDate({
      start: start,
      end: nextDay,
    });

    await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

    return result;
  }

  @ResolveField((_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.homeEvalService.averageFeedbackLength();
  }

  @ResolveField((_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.homeEvalService.averageCommentLength();
  }
}
