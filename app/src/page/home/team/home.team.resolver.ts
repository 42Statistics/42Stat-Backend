import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { HomeTeamService } from './home.team.service';
import { HomeTeam, ProjectRanking } from './models/home.team.model';

@Resolver((_of: unknown) => HomeTeam)
export class HomeTeamResolver {
  constructor(private homeTeamService: HomeTeamService) {}

  @Query((_of) => HomeTeam)
  async getHomeTeam() {
    return await this.homeTeamService.temp();
  }

  @ResolveField((_returns) => [ProjectRanking])
  async currRegisteredCountRanking(): Promise<ProjectRanking[]> {
    return await this.homeTeamService.currRegisteredCountRanking();
  }
}
