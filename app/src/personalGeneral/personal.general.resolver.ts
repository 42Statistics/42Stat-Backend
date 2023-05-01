import {
  Args,
  Context,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  LevelGraphDateRanged,
  LogtimeInfoDateRanged,
  PersonalGeneral,
  TeamInfo,
} from './models/personal.general.model';
import { UserProfile } from './models/personal.general.userProfile.model';
import { PersonalGeneralService } from './personal.general.service';

type PersonalGeneralContext = { uid: number };

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(private personalGeneralService: PersonalGeneralService) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonGeneralPage(
    @Args('uid') uid: number,
    @Context() context: PersonalGeneralContext,
  ): Promise<{ userProfile: UserProfile }> {
    const userProfile = await this.personalGeneralService.getUserInfo(uid);
    context.uid = userProfile.id;

    return { userProfile };
  }

  @ResolveField('logtimeInfo', (_returns) => LogtimeInfoDateRanged)
  async getLogtimeInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<LogtimeInfoDateRanged> {
    const uid = context.uid;
    return await this.personalGeneralService.getLogtimeInfoById(uid);
  }

  @ResolveField('teamInfo', (_returns) => TeamInfo)
  async getTeamInfo(
    @Context() context: PersonalGeneralContext,
  ): Promise<TeamInfo> {
    const uid = context.uid;
    return await this.personalGeneralService.getTeamInfoById(uid);
  }

  @ResolveField('levelGraphs', (_returns) => LevelGraphDateRanged)
  async getLevelGraphs(
    @Context() context: PersonalGeneralContext,
  ): Promise<LevelGraphDateRanged> {
    const uid = context.uid;
    return await this.personalGeneralService.getLevelHistroyById(uid);
  }

  @ResolveField('levelRank', (_returns) => Int)
  async getLevelRank(
    @Context() context: PersonalGeneralContext,
  ): Promise<number> {
    const uid = context.uid;
    return await this.personalGeneralService.getLevelRank(uid);
  }
}
