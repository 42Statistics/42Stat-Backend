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
import { GetScaleTeamsArgs } from './dto/getScaleTeams.args';
import { GetScaleTeamsGraphArgs } from './dto/getScaleTeamsGraph.args';
import { ScaleTeam } from './models/scaleTeam.model';
import { ScaleTeamsGraph } from './models/scaleTeams.graph.model';
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

  @Query((_returns) => [ScaleTeam], { nullable: 'items' })
  // todo
  // eslint-disable-next-line
  async getScaleTeams(@Args() args: GetScaleTeamsArgs) {
    return [this.scaleTeamsService.findById('1')];
  }

  @Query((_returns) => ScaleTeamsGraph)
  // todo
  // eslint-disable-next-line
  async getScaleTeamsGraph(@Args() args: GetScaleTeamsGraphArgs) {
    return {
      totalCount: 1,
      averageFeedbackLength: 123,
      periodicCount: {
        first: 7,
        after: new Date(),
        value: [1, 2, 3, 4, 5, 6, 7],
      },
    };
  }

  @ResolveField((_returns) => TeamPopulated)
  async teamPopulated(@Parent() scaleTeam: ScaleTeam) {
    return this.teamsService.getTeamById(scaleTeam.scaleTeamTeamPartial.id);
  }
}
