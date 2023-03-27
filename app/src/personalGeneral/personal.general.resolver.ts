import { Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { EvalUserInfo, LevelGraph, LogtimeInfo, PersonalGeneral, TeamInfo } from './models/personal.general.model';
import { UserProfile } from './models/personal.general.profile.model';
import { PersonalGeneralService } from './personal.general.service';

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(private personalGeneralService: PersonalGeneralService) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonGeneralPage() {
    return {};
  }

  @ResolveField('evalUserInfo', (_returns) => EvalUserInfo)
  async getEvalUserInfo() {
    const evalUserInfo = await this.personalGeneralService.getEvalUserInfoByUid('99947');
    return evalUserInfo;
  }

  @ResolveField('logtimeInfo', (_returns) => LogtimeInfo)
  async getLogtimeInfo() {
    return await this.personalGeneralService.getLogtimeInfoByUid('99947');
  }

  @ResolveField('teamInfo', (_returns) => TeamInfo)
  async getTeamInfo() {
    return await this.personalGeneralService.getTeamInfoByUid('99947');
  }

  @ResolveField('levelGraphs', (_returns) => LevelGraph)
  async getLevelHistory() {
    return await this.personalGeneralService.getLevelHistroyByUid('99947');
  }
}

@Resolver((_of: unknown) => UserProfile)
export class UserProfileResolver {
  constructor(private personalGeneralService: PersonalGeneralService) {}

  @ResolveField('personalProfile', (_retuns) => UserProfile)
  async getUserInfo() {
    return await this.personalGeneralService.getUserInfo('99947');
  }

  @ResolveField('levelRank', (_returns) => Int)
  async getLevelRank() {
    return 24;
  }
}
