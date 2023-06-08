import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { IntRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { HomeUserService } from './home.user.service';
import {
  HomeUser,
  IntPerCircle,
  UserCountPerLevels,
} from './models/home.user.model';

@Resolver((_of: unknown) => HomeUser)
export class HomeUserResolver {
  constructor(private homeUserService: HomeUserService) {}

  @Query((_of) => HomeUser)
  async getHomeUser() {
    return {};
  }

  @ResolveField((_returns) => [IntRecord])
  async activeUserCountRecords(): Promise<IntRecord[]> {
    return await this.homeUserService.activeUserCountRecords();
  }

  @ResolveField((_returns) => [UserCountPerLevels])
  async userCountPerLevel(): Promise<UserCountPerLevels[]> {
    return await this.homeUserService.userCountPerLevels();
  }

  @ResolveField((_returns) => IntRate)
  async memberRate(): Promise<IntRate> {
    return await this.homeUserService.memberRate();
  }

  @ResolveField((_returns) => IntRate)
  async blackholedRate(): Promise<IntRate> {
    return await this.homeUserService.blackholedRate();
  }

  @ResolveField((_returns) => IntDateRanged)
  async blackholedCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ) {
    return await this.homeUserService.blackholedCountByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField((_returns) => [IntPerCircle])
  async blackholedCountPerCircles(): Promise<IntPerCircle[]> {
    return await this.homeUserService.blackholedCountPerCircles();
  }

  @ResolveField((_returns) => [UserRanking])
  async walletRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeUserService.walletRanks(limit);
  }

  @ResolveField((_returns) => [UserRanking])
  async correctionPointRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeUserService.correctionPointRanks(limit);
  }

  @ResolveField((_returns) => [IntPerCircle])
  async averageCircleDurations(): Promise<IntPerCircle[]> {
    return await this.homeUserService.averageCircleDurations();
  }
}
