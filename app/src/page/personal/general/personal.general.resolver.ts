import { UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { CustomAuthGuard } from 'src/auth/customAuthGuard';
import { CustomContext } from 'src/auth/customContext';
import {
  IntDateRanged,
  StringDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { PersonalUtilService } from '../util/personal.util.service';
import {
  LevelRecord,
  PersonalGeneral,
  PersonalGeneralRoot,
  PreferredTimeDateRanged,
  TeamInfo,
  UserScoreInfo,
} from './models/personal.general.model';
import { PersonalGeneralService } from './personal.general.service';

@UseGuards(CustomAuthGuard)
@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(
    private personalGeneralService: PersonalGeneralService,
    private personalUtilService: PersonalUtilService,
  ) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonalGeneralPage(
    @CustomContext() myId: number,
    @Args('login', { nullable: true }) login?: string,
    @Args('userId', { nullable: true }) userId?: number,
  ): Promise<PersonalGeneralRoot> {
    const targetUserId = await this.personalUtilService.selectUserId(
      myId,
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

  @ResolveField((_returns) => StringDateRanged)
  async preferredClusterByDateTemplate(
    @Root() root: PersonalGeneralRoot,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<StringDateRanged> {
    return await this.personalGeneralService.preferredClusterByDateTemplate(
      root.userProfile.id,
      dateTemplate,
    );
  }

  @ResolveField((_returns) => TeamInfo)
  async teamInfo(@Root() root: PersonalGeneralRoot): Promise<TeamInfo> {
    return await this.personalGeneralService.teamInfo(root.userProfile.id);
  }

  @ResolveField((_returns) => [LevelRecord])
  async levelRecords(
    @Root() root: PersonalGeneralRoot,
  ): Promise<LevelRecord[]> {
    return await this.personalGeneralService.levelRecords(root.userProfile.id);
  }
}
