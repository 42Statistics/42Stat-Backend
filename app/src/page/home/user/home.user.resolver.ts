import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { Rate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { HomeUserService } from './home.user.service';
import {
  HomeUser,
  IntPerCircle,
  UserCountPerLevel,
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

  @ResolveField((_returns) => IntDateRanged)
  async blackholedCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ) {
    return await this.homeUserService.blackholedCountByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField((_returns) => [IntPerCircle])
  async blackholedCountPerCircle(): Promise<IntPerCircle[]> {
    return await this.homeUserService.blackholedCountPerCircle();
  }

  @ResolveField((_returns) => [UserRanking])
  async walletRanking(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeUserService.walletRanks(limit);
  }

  @ResolveField((_returns) => [UserRanking])
  async correctionPointRanking(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeUserService.correctionPointRanking(limit);
  }

  @ResolveField((_returns) => [IntPerCircle])
  async averageDurationPerCircle(): Promise<IntPerCircle[]> {
    return await this.homeUserService.averageDuerationPerCircle();
  }
}
