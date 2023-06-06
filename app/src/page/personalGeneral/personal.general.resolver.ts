import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  IntDateRanged,
  StringDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import {
  LevelRecord,
  PersonalGeneral,
  PreferredTimeDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import { UserScoreRank } from './models/personal.general.userProfile.model';
import { PersonalGeneralService } from './personal.general.service';

export type PersonalGeneralContext = {
  userId: number;
};

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(private personalGeneralService: PersonalGeneralService) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonalGeneralPage(
    @Context() context: PersonalGeneralContext,
    @Args('login', { nullable: true }) login?: string,
    @Args('userId', { nullable: true }) userId?: number,
  ): Promise<
    Pick<PersonalGeneral, 'userProfile' | 'beginAt' | 'blackholedAt' | 'wallet'>
  > {
    const targetUserId = await this.personalGeneralService.selectUserId({
      context,
      login,
      userId,
    });

    // todo: auth guard
    context.userId = targetUserId;

    return await this.personalGeneralService.personalGeneralProfile(
      targetUserId,
    );
  }

  @ResolveField('scoreInfo', (_returns) => UserScoreRank)
  async scoreInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<UserScoreRank> {
    return await this.personalGeneralService.scoreInfo(context.userId);
  }

  @ResolveField('logtimeByDateTemplate', (_returns) => IntDateRanged)
  async logtimeByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
    @Context() { userId }: PersonalGeneralContext,
  ): Promise<IntDateRanged> {
    return await this.personalGeneralService.logtimeByDateTemplate(
      userId,
      dateTemplate,
    );
  }

  @ResolveField(
    'preferredTimeByDateTemplate',
    (_returns) => PreferredTimeDateRanged,
  )
  async preferredTimeByDateTemplate(
    @Context() context: PersonalGeneralContext,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<PreferredTimeDateRanged> {
    return await this.personalGeneralService.preferredTimeByDateTemplate(
      context.userId,
      dateTemplate,
    );
  }

  @ResolveField(
    'preferredClusterByDateTemplate',
    (_returns) => StringDateRanged,
  )
  async preferredClusterByDateTemplate(
    @Context() context: PersonalGeneralContext,
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<StringDateRanged> {
    return await this.personalGeneralService.preferredClusterByDateTemplate(
      context.userId,
      dateTemplate,
    );
  }

  @ResolveField('teamInfo', (_returns) => TeamInfo)
  async teamInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<TeamInfo> {
    return await this.personalGeneralService.teamInfo(context.userId);
  }

  @ResolveField('levelRecords', (_returns) => [LevelRecord])
  async levelRecords(
    @Context() context: PersonalGeneralContext,
  ): Promise<LevelRecord[]> {
    return await this.personalGeneralService.levelRecords(context.userId);
  }
}
