import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { PersonalUtilService } from '../util/personal.util.service';
import {
  Character,
  LevelRecord,
  PersonalGeneral,
  PersonalGeneralRoot,
  PreferredClusterDateRanged,
  PreferredTimeDateRanged,
  TeamInfo,
  UserScoreInfo,
} from './models/personal.general.model';
import { PersonalGeneralService } from './personal.general.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(
    private personalGeneralService: PersonalGeneralService,
    private personalUtilService: PersonalUtilService,
  ) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonalGeneral(
    @MyUserId() myUserId: number,
    @Args('login', { nullable: true }) login?: string,
    @Args('userId', { nullable: true }) userId?: number,
  ): Promise<PersonalGeneralRoot> {
    const targetUserId = await this.personalUtilService.selectUserId(
      myUserId,
      userId,
      login,
    );

    return await this.personalGeneralService.personalGeneralProfile(
      targetUserId,
    );
  }

  @ResolveField((_returns) => UserScoreInfo)
  async scoreInfo(
    @Root() root: PersonalGeneralRoot,
  ): Promise<UserScoreInfo | null> {
    return await this.personalGeneralService.scoreInfo(root.userProfile.id);
  }

  @ResolveField((_returns) => IntDateRanged)
  async logtimeByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
    @Root() root: PersonalGeneralRoot,
  ): Promise<IntDateRanged> {
    return await this.personalGeneralService.logtimeByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => PreferredTimeDateRanged)
  async preferredTimeByDateTemplate(
    @Root() root: PersonalGeneralRoot,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<PreferredTimeDateRanged> {
    return await this.personalGeneralService.preferredTimeByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => PreferredClusterDateRanged)
  async preferredClusterByDateTemplate(
    @Root() root: PersonalGeneralRoot,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<PreferredClusterDateRanged> {
    return await this.personalGeneralService.preferredClusterByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => TeamInfo)
  async teamInfo(@Root() root: PersonalGeneralRoot): Promise<TeamInfo> {
    return await this.personalGeneralService.teamInfo(root.userProfile.id);
  }

  @ResolveField((_returns) => [LevelRecord], { nullable: 'items' })
  async userLevelRecords(
    @Root() root: PersonalGeneralRoot,
  ): Promise<LevelRecord[]> {
    return await this.personalGeneralService.userLevelRecords(
      root.userProfile.id,
    );
  }

  @ResolveField((_returns) => [LevelRecord])
  async memberLevelRecords(): Promise<LevelRecord[]> {
    return await this.personalGeneralService.memberLevelRecords();
  }

  @ResolveField((_returns) => Character, { nullable: true })
  async character(
    @Root() root: PersonalGeneralRoot,
  ): Promise<Character | null> {
    return await this.personalGeneralService.character(root.userProfile.id);
  }
}
