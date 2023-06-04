import { Query, Resolver } from '@nestjs/graphql';
import { HomeTeam } from './models/home.team.model';
import { HomeTeamService } from './home.team.service';

@Resolver((_of: unknown) => HomeTeam)
export class HomeTeamResolver {
  constructor(private homeTeamService: HomeTeamService) {}

  @Query((_of) => HomeTeam)
  async getHomeTeam() {
    return await this.homeTeamService.temp();
  }
}
