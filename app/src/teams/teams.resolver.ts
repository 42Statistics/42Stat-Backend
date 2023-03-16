import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { GetTeamsArgs } from './dto/getTeams.args';
import { Team } from './models/team.model';
import { TeamsService } from './teams.service';

@Resolver((_of: unknown) => Team)
export class TeamsResolver {
  constructor(private teamsService: TeamsService) {}

  @Query((_returns) => Team, { nullable: true })
  async getTeamById(@Args('id', { type: () => ID }) id: string) {
    this.teamsService.getTeamById(id);
  }

  // todo: pagenated type 설정
  @Query((_returns) => [Team], { nullable: 'items' })
  // todo
  // eslint-disable-next-line
  async getTeams(@Args() args: GetTeamsArgs) {
    return [this.teamsService.getTeamById('1')];
  }
}
