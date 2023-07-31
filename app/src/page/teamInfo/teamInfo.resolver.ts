import { Args, Query, Resolver } from '@nestjs/graphql';
import { TeamInfo } from './models/teamInfo.model';
import { TeamInfoService } from './teamInfo.service';

@Resolver((_of: unknown) => TeamInfo)
export class TeamInfoResolver {
  constructor(private readonly teamInfoService: TeamInfoService) {}

  @Query((_returns) => TeamInfo)
  async getTeamInfo(@Args('id') id: number): Promise<TeamInfo> {
    return await this.teamInfoService.getTeamInfo(id);
  }
}
