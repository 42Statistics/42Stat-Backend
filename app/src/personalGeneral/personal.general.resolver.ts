import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRanking } from 'src/common/models/common.user.model';
import {
  EvalUserInfo,
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

  @ResolveField('evalUserInfo', (_returns) => EvalUserInfo)
  async getEvalUserInfo() {
    const evalUserInfo = await this.personalGeneralService.getEvalUserInfoByUid(
      99947,
    );
    return evalUserInfo;
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

  //유저가 한 평가 횟수
  @ResolveField('personalTotalEvalCnt', (_returns) => Int)
  async personalTotalEvalCnt(@Args('uid') uid: number): Promise<number> {
    return await this.personalGeneralService.personalTotalEvalCnt(uid);
  }

  @ResolveField('destinyUsers', (_returns) => [UserRanking])
  async destinyUsers(@Args('uid') uid: number): Promise<UserRanking[]> {
    return await this.personalGeneralService.destinyUsers(uid);
  }
}
