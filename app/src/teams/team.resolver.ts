import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { Team } from './models/team.model';
import { TeamsService } from './teams.service';

@Resolver((_of: unknown) => Team)
export class TeamResolver {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Query((_returns) => Team, { name: 'team' })
  async getTeam(@Args('id', { type: () => Int }) id: number) {
    return await this.teamsService.findById(id);
  }

  @ResolveProperty()
  async _users(@Parent() team: Team) {
    const uids = team.users.map((curr) => curr.id);
    return await this.usersService.findAllByIds(uids);
  }

  @ResolveField()
  async _project(@Parent() team: Team) {
    const projectId = team.projectId;
    return await this.projectsService.findById(projectId);
  }
}
