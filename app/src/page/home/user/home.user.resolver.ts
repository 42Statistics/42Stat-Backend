import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { Rate } from 'src/common/models/common.rate.model';
import { UserRank } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeUserService } from './home.user.service';
import {
  HomeUser,
  IntPerCircle,
  UserCountPerLevel,
} from './models/home.user.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeUser)
export class HomeUserResolver {
  constructor(private readonly homeUserService: HomeUserService) {}

  @Query((_of) => HomeUser)
  async getHomeUser() {
    return {};
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
  async memberRate(): Promise<Rate> {
    return await this.homeUserService.memberRate();
  }

  @ResolveField((_returns) => Rate)
  async blackholedRate(): Promise<Rate> {
    return await this.homeUserService.blackholedRate();
  }

  @ResolveField((_returns) => [IntRecord], { description: '1 ~ 24 개월' })
  async blackholedCountRecords(
    @Args('last') last: number,
  ): Promise<IntRecord[]> {
    return await this.homeUserService.blackholedCountRecords(
      Math.max(1, Math.min(last, 24)),
    );
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
