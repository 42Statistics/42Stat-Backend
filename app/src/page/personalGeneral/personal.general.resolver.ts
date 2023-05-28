import {
  Args,
  Context,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  NumberDateRanged,
  StringDateRanged,
} from 'src/common/models/common.number.dateRanaged';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  LevelGraphDateRanged,
  PersonalGeneral,
  PreferredTimeDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import {
  UserProfile,
  UserScoreRank,
} from './models/personal.general.userProfile.model';
import { PersonalGeneralService } from './personal.general.service';

type PersonalGeneralContext = { uid: number };

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(
    private personalGeneralService: PersonalGeneralService,
    private cursusUserService: CursusUserService,
  ) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonGeneralPage(
    @Args('uid', { nullable: true }) uid: number,
    @Args('login', { nullable: true }) login: string,
    @Context() context: PersonalGeneralContext,
  ): Promise<{ userProfile: UserProfile }> {
    const cursusUser = await this.cursusUserService.findUser(uid, login);
    context.uid = cursusUser.user.id;

    const userProfile = await this.personalGeneralService.getUserInfo(
      context.uid,
    );

    return { userProfile };
  }

  @ResolveField('beginAt', (_returns) => Date)
  async beginAt(@Context() context: PersonalGeneralContext): Promise<Date> {
    return await this.personalGeneralService.beginAt(context.uid);
  }

  @ResolveField('blackholedAt', (_returns) => Date)
  async blackholedAt(
    @Context() context: PersonalGeneralContext,
  ): Promise<Date> {
    return await this.personalGeneralService.blackholedAt(context.uid);
  }

  @ResolveField('wallet', (_returns) => Int)
  async wallet(@Context() context: PersonalGeneralContext): Promise<number> {
    return await this.personalGeneralService.wallet(context.uid);
  }

  @ResolveField('scoreInfo', (_returns) => UserScoreRank)
  async scoreInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<UserScoreRank> {
    return await this.personalGeneralService.scoreInfo(context.uid);
  }

  @ResolveField('currMonthLogtime', (_returns) => NumberDateRanged)
  async currMonthLogtime(
    @Context() context: PersonalGeneralContext,
  ): Promise<NumberDateRanged> {
    return await this.personalGeneralService.currMonthLogtime(context.uid);
  }

  @ResolveField('lastMonthLogtime', (_returns) => NumberDateRanged)
  async lastMonthLogtime(
    @Context() context: PersonalGeneralContext,
  ): Promise<NumberDateRanged> {
    return await this.personalGeneralService.lastMonthLogtime(context.uid);
  }

  @ResolveField('preferredTime', (_returns) => PreferredTimeDateRanged)
  async preferredTime(
    @Context() context: PersonalGeneralContext,
  ): Promise<PreferredTimeDateRanged> {
    return await this.personalGeneralService.preferredTime(context.uid);
  }

  @ResolveField('preferredCluster', (_returns) => StringDateRanged)
  async preferredCluster(
    @Args('start', { nullable: true }) start: Date,
    @Args('end', { nullable: true }) end: Date,
    @Context() context: PersonalGeneralContext,
  ): Promise<StringDateRanged> {
    return await this.personalGeneralService.preferredCluster(
      context.uid,
      start,
      end,
    );
  }

  @ResolveField('teamInfo', (_returns) => TeamInfo)
  async getTeamInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<TeamInfo> {
    return await this.personalGeneralService.getTeamInfoById(context.uid);
  }

  @ResolveField('levelGraphs', (_returns) => LevelGraphDateRanged)
  async getLevelGraphs(
    @Context() context: PersonalGeneralContext,
  ): Promise<LevelGraphDateRanged> {
    return await this.personalGeneralService.getLevelHistroyById(context.uid);
  }

  // @ResolveField('levelRank', (_returns) => Int)
  // async getLevelRank(
  //   @Context() context: PersonalGeneralContext,
  // ): Promise<number> {
  //   return await this.personalGeneralService.getLevelRank(context.uid);
  // }
}
