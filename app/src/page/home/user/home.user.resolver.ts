import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActiveUserCountService } from 'src/activeUserCount/activeUserCount.service';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { Rate } from 'src/common/models/common.rate.model';
import { UserRank } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeUserService } from './home.user.service';
import {
  GetHomeUserAliveUserCountRecordsByDateArgs,
  GetHomeUserAliveUserCountRecordsFromEndArgs,
  GetHomeUserAliveUserCountRecordsFromStartArgs,
  GetHomeUserBlackholedCountRecordsArgs,
  GetHomeUserMonthlyActiveUserCountRecordsFromEndArgs,
  HomeUser,
  IntPerCircle,
  UserCountPerLevel,
} from './models/home.user.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeUser)
export class HomeUserResolver {
  constructor(
    private readonly homeUserService: HomeUserService,
    private readonly activeUserCountService: ActiveUserCountService,
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  @Query((_of) => HomeUser)
  async getHomeUser() {
    return {};
  }

  @ResolveField((_returns) => [IntRecord])
  async monthlyAliveUserCountRecordsFromStart(
    @Args() { first }: GetHomeUserAliveUserCountRecordsFromStartArgs,
  ) {
    const start = new DateWrapper('2020-02-24T04:42:00.000+00:00')
      .startOfMonth()
      .toDate();

    const end = new DateWrapper(start).moveMonth(first).toDate();

    const cacheKey = `homeUserDailyAliveUserCountRecords:${start.getTime()}:${end.getTime()}`;

    const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.homeUserService.monthlyAliveUserCountRecords({
      start,
      end,
    });

    await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

    return result;
  }

  @ResolveField((_returns) => [IntRecord])
  async monthlyAliveUserCountRecordsFromEnd(
    @Args() { last }: GetHomeUserAliveUserCountRecordsFromEndArgs,
  ) {
    const nextMonth = new DateWrapper().startOfMonth().moveMonth(1).toDate();
    const start = new DateWrapper()
      .startOfMonth()
      .moveMonth(1 - last)
      .toDate();

    const cacheKey = `homeUserDailyAliveUserCountRecords:${start.getTime()}:${nextMonth.getTime()}`;

    const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.homeUserService.monthlyAliveUserCountRecords({
      start,
      end: nextMonth,
    });

    await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

    return result;
  }

  @ResolveField((_returns) => [IntRecord])
  async monthlyAliveUserCountRecordsByDate(
    @Args()
    { firstOrLast, timestamp }: GetHomeUserAliveUserCountRecordsByDateArgs,
  ) {
    if (firstOrLast > 0) {
      const start = new DateWrapper(timestamp * DateWrapper.SEC)
        .startOfMonth()
        .toDate();

      const end = new DateWrapper(start).moveMonth(firstOrLast).toDate();

      const cacheKey = `homeUserDailyAliveUserCountRecords:${start.getTime()}:${end.getTime()}`;

      const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.homeUserService.monthlyAliveUserCountRecords({
        start,
        end,
      });

      await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

      return result;
    } else {
      const end = new DateWrapper(timestamp * DateWrapper.SEC)
        .startOfMonth()
        .moveMonth(1)
        .toDate();

      const start = new DateWrapper(end).moveMonth(firstOrLast).toDate();

      const cacheKey = `homeUserDailyAliveUserCountRecords:${start.getTime()}:${end.getTime()}`;

      const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.homeUserService.monthlyAliveUserCountRecords({
        start,
        end,
      });

      await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

      return result;
    }
  }

  @ResolveField((_returns) => [IntRecord])
  async monthlyActiveUserCountRecordsFromEnd(
    @Args() { last }: GetHomeUserMonthlyActiveUserCountRecordsFromEndArgs,
  ): Promise<IntRecord[]> {
    const nextMonth = new DateWrapper().startOfMonth().moveMonth(1).toDate();
    const start = new DateWrapper()
      .startOfMonth()
      .moveMonth(1 - last)
      .toDate();

    const cacheKey = `homeUserMonthlyActiveUserCountRecordsFromEnd:${start.getTime()}:${nextMonth.getTime()}`;

    const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const activeUserCountList = await this.activeUserCountService.getAllByDate({
      start,
      end: nextMonth,
    });

    const result = activeUserCountList.map((activeUserCount) => ({
      at: activeUserCount.date,
      value: activeUserCount.count,
    }));

    await this.cacheUtilService.set(cacheKey, result, DateWrapper.MIN);

    return result;
  }

  @ResolveField((_returns) => [IntRecord])
  async aliveUserCountRecords(): Promise<IntRecord[]> {
    return await this.homeUserService.aliveUserCountRecords();
  }

  @ResolveField((_returns) => [UserCountPerLevel])
  async userCountPerLevel(): Promise<UserCountPerLevel[]> {
    return await this.homeUserService.userCountPerLevels();
  }

  @ResolveField((_returns) => Rate)
  async userRate(): Promise<Rate> {
    return await this.homeUserService.userRate();
  }

  @ResolveField((_returns) => Rate)
  async memberRate(): Promise<Rate> {
    return await this.homeUserService.memberRate();
  }

  @ResolveField((_returns) => Rate)
  async blackholedRate(): Promise<Rate> {
    return await this.homeUserService.blackholedRate();
  }

  @ResolveField((_returns) => [IntRecord], {
    description: '1 ~ 120 개월',
  })
  async blackholedCountRecords(
    @Args() { last }: GetHomeUserBlackholedCountRecordsArgs,
  ): Promise<IntRecord[]> {
    const nextMonth = DateWrapper.nextMonth().toDate();
    const start = DateWrapper.currMonth()
      .moveMonth(1 - last)
      .toDate();

    const cacheKey = `homeUserBlackholedCountRecords:${start.getTime()}:${nextMonth.getTime()}`;

    const cached = await this.cacheUtilService.get<IntRecord[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.homeUserService.blackholedCountRecords({
      start,
      end: nextMonth,
    });

    await this.cacheUtilService.set(cacheKey, result);

    return result;
  }

  @ResolveField((_returns) => [IntPerCircle])
  async blackholedCountPerCircle(): Promise<IntPerCircle[]> {
    return await this.homeUserService.blackholedCountPerCircle();
  }

  @ResolveField((_returns) => [UserRank])
  async walletRanking(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRank[]> {
    return await this.homeUserService.walletRanking(limit);
  }

  @ResolveField((_returns) => [UserRank])
  async correctionPointRanking(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRank[]> {
    return await this.homeUserService.correctionPointRanking(limit);
  }

  @ResolveField((_returns) => [IntPerCircle])
  async averageDurationPerCircle(): Promise<IntPerCircle[]> {
    return await this.homeUserService.averageDuerationPerCircle();
  }
}
