import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CursusUserService } from 'src/cursusUser/cursusUser.service';
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
    if (login) {
      const [cursusUser] = await this.cursusUserService.findAll({
        'user.login': login,
      });

      if (!cursusUser) {
        throw new NotFoundException();
      }

      context.uid = cursusUser.user.id;
    } else if (uid) {
      context.uid = uid;
    } else {
      throw new NotFoundException();
    }

    const userProfile = await this.personalGeneralService.getUserInfo(
      context.uid,
    );

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
