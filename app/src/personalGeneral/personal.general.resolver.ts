import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  LevelGraph,
  LogtimeInfo,
  PersonalGeneral,
  TeamInfo,
} from './models/personal.general.model';
import { UserProfile } from './models/personal.general.userProfile.model';
import { PersonalGeneralService } from './personal.general.service';

@Resolver((_of: unknown) => PersonalGeneral)
export class PersonalGeneralResolver {
  constructor(private personalGeneralService: PersonalGeneralService) {}

  @Query((_returns) => PersonalGeneral)
  async getPersonGeneralPage() {
    return {};
  }

  @ResolveField('logtimeInfo', (_returns) => LogtimeInfo)
  async getLogtimeInfo() {
    return await this.personalGeneralService.getLogtimeInfoByUid(99947);
  }

  @ResolveField('teamInfo', (_returns) => TeamInfo)
  async getTeamInfo() {
    return await this.personalGeneralService.getTeamInfoByUid(99947);
  }

  @ResolveField('levelGraphs', (_returns) => [LevelGraph])
  async getLevelHistory() {
    return await this.personalGeneralService.getLevelHistroyByUid(99947);
  }

  @ResolveField('userProfile', (_returns) => UserProfile)
  async getUserInfo() {
    return await this.personalGeneralService.getUserInfo(99947);
  }
}
