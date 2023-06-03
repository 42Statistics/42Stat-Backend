import {
  Args,
  Context,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  NumberDateRanged,
  StringDateRanged,
} from 'src/common/models/common.number.dateRanaged';
import { dateRangeFromTemplate } from 'src/dateRange/dateRange.service';
import {
  DateRangeArgs,
  DateTemplateArgs,
} from 'src/dateRange/dtos/dateRange.dto';
import {
  LevelGraphDateRanged,
  PersonalGeneral,
  PreferredTime,
  PreferredTimeDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import {
  UserProfile,
  UserScoreRank,
} from './models/personal.general.userProfile.model';
import { PersonalGeneralService } from './personal.general.service';

type PersonalGeneralContext = { userId: number };

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(
    private personalGeneralService: PersonalGeneralService,
    private cursusUserService: CursusUserService,
  ) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonGeneralPage(
    @Args('userId', { nullable: true }) userId: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PersonalGeneralContext,
  ): Promise<{ userProfile: UserProfile }> {
    const cursusUser = await this.cursusUserService.findUser(userId, login);
    context.userId = cursusUser.user.id;

    const userProfile = await this.personalGeneralService.userInfo(
      context.userId,
    );

    return { userProfile };
  }

  @ResolveField('beginAt', (_returns) => Date)
  async beginAt(@Context() context: PersonalGeneralContext): Promise<Date> {
    return await this.personalGeneralService.beginAt(context.userId);
  }

  @ResolveField('blackholedAt', (_returns) => Date)
  async blackholedAt(
    @Context() context: PersonalGeneralContext,
  ): Promise<Date> {
    return await this.personalGeneralService.blackholedAt(context.userId);
  }

  @ResolveField('wallet', (_returns) => Int)
  async wallet(@Context() context: PersonalGeneralContext): Promise<number> {
    return await this.personalGeneralService.wallet(context.userId);
  }

  @ResolveField('scoreInfo', (_returns) => UserScoreRank)
  async scoreInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<UserScoreRank> {
    return await this.personalGeneralService.scoreInfo(context.userId);
  }

  @ResolveField('currMonthLogtime', (_returns) => NumberDateRanged)
  async currMonthLogtime(
    @Context() context: PersonalGeneralContext,
  ): Promise<NumberDateRanged> {
    return await this.personalGeneralService.currMonthLogtime(context.userId);
  }

  @ResolveField('lastMonthLogtime', (_returns) => NumberDateRanged)
  async lastMonthLogtime(
    @Context() context: PersonalGeneralContext,
  ): Promise<NumberDateRanged> {
    return await this.personalGeneralService.lastMonthLogtime(context.userId);
  }

  @ResolveField('preferredTime', (_returns) => PreferredTime)
  async preferredTime(
    @Context() context: PersonalGeneralContext,
  ): Promise<PreferredTime> {
    return await this.personalGeneralService.preferredTime(context.userId);
  }

  @ResolveField(
    'preferredTimeByDateRange',
    (_returns) => PreferredTimeDateRanged,
  )
  async preferredTimeByDateRange(
    @Context() context: PersonalGeneralContext,
    @Args() dateRange: DateRangeArgs,
  ): Promise<PreferredTimeDateRanged> {
    return await this.personalGeneralService.preferredTimeByDateRange(
      context.userId,
      dateRange,
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
    const dateRange = dateRangeFromTemplate(dateTemplate);

    return await this.personalGeneralService.preferredTimeByDateRange(
      context.userId,
      dateRange,
    );
  }

  @ResolveField('preferredCluster', (_returns) => String)
  async preferredCluster(
    @Context() context: PersonalGeneralContext,
  ): Promise<string> {
    return await this.personalGeneralService.preferredCluster(context.userId);
  }

  @ResolveField('preferredClusterByDateRange', (_returns) => StringDateRanged)
  async preferredClusterByDateRange(
    @Context() context: PersonalGeneralContext,
    @Args() dateRange: DateRangeArgs,
  ): Promise<StringDateRanged> {
    return await this.personalGeneralService.preferredClusterByDateRange(
      context.userId,
      dateRange,
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
    const dateRange = dateRangeFromTemplate(dateTemplate);

    return await this.personalGeneralService.preferredClusterByDateRange(
      context.userId,
      dateRange,
    );
  }

  @ResolveField('teamInfo', (_returns) => TeamInfo)
  async teamInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<TeamInfo> {
    return await this.personalGeneralService.userTeamInfo(context.userId);
  }

  @ResolveField('levelGraphs', (_returns) => LevelGraphDateRanged)
  async levelGraphs(
    @Context() context: PersonalGeneralContext,
  ): Promise<LevelGraphDateRanged> {
    return await this.personalGeneralService.userLevelHistroy(context.userId);
  }
}
