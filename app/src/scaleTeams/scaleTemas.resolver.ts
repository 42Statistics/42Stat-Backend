import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TeamPopulated } from 'src/teams/models/team.model';
import { TeamsService } from 'src/teams/teams.service';
import { ScaleTeam } from './models/scaleTeam.model';
import { ScaleTeamsService } from './scaleTeams.service';

@Resolver((_of: unknown) => ScaleTeam)
export class ScaleTeamsResolver {
  constructor(
    private scaleTeamsService: ScaleTeamsService,
    private teamsService: TeamsService,
  ) {}

  @Query((_returns) => ScaleTeam, { nullable: true })
  async getScaleTeamById(@Args('id', { type: () => ID }) id: string) {
    return this.scaleTeamsService.findById(id);
  }

  @ResolveField((_returns) => TeamPopulated)
  async teamPopulated(@Parent() scaleTeam: ScaleTeam) {
    return this.teamsService.getTeamById(scaleTeam.scaleTeamTeamPartial.id);
  }
}
