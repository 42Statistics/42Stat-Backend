import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { IntRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { ValueRecord } from '../models/home.model';
import { HomeUserService } from './home.user.service';
import {
  HomeUser,
  UserCountPerLevels,
  ValuePerCircle,
} from './models/home.user.model';

@Resolver((_of: unknown) => HomeUser)
export class HomeUserResolver {
  constructor(private homeUserService: HomeUserService) {}

  @Query((_of) => HomeUser)
  async getHomeUser() {
    return {};
  }

  @ResolveField('activeUserCountRecords', (_returns) => [ValueRecord])
  async activeUserCountRecords(): Promise<ValueRecord[]> {
    return await this.homeUserService.activeUserCountRecords();
  }

  @ResolveField('userCountPerLevels', (_returns) => [UserCountPerLevels])
  async userCountPerLevel(): Promise<UserCountPerLevels[]> {
    return await this.homeUserService.userCountPerLevels();
  }

  @ResolveField('memberRate', (_returns) => IntRate)
  async memberRate(): Promise<IntRate> {
    return await this.homeUserService.memberRate();
  }

  @ResolveField('blackholedRate', (_returns) => IntRate)
  async blackholedRate(): Promise<IntRate> {
    return await this.homeUserService.blackholedRate();
  }

  @ResolveField('blackholedCountByDateTemplate', (_returns) => IntDateRanged)
  async blackholedCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ) {
    return await this.homeUserService.blackholedCountByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField('blackholedCountPerCircles', (_returns) => [ValuePerCircle])
  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.homeUserService.blackholedCountPerCircles();
  }

  @ResolveField('walletRanks', (_returns) => [UserRanking])
  async walletRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeUserService.walletRanks(limit);
  }

  @ResolveField('correctionPointRanks', (_returns) => [UserRanking])
  async correctionPointRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeUserService.correctionPointRanks(limit);
  }

  @ResolveField('averageCircleDurations', (_returns) => [ValuePerCircle])
  async averageCircleDurations(): Promise<ValuePerCircle[]> {
    return await this.homeUserService.averageCircleDurations();
  }
}
