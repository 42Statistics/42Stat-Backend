import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HomeTeamService } from './home.team.service';
import { HomeTeam, ProjectRank } from './models/home.team.model';

@Resolver((_of: unknown) => HomeTeam)
export class HomeTeamResolver {
  constructor(private homeTeamService: HomeTeamService) {}

  @Query((_of) => HomeTeam)
  async getHomeTeam() {
    return await this.homeTeamService.temp();
  }

  @ResolveField((_returns) => [ProjectRank])
  async currRegisteredCountRanking(
    @Args('limit', { defaultValue: 3 }) limit: number,
  ): Promise<ProjectRank[]> {
    return await this.homeTeamService.currRegisteredCountRanking(limit);
  }
}
