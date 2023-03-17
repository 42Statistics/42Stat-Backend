import {
  forwardRef,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationArgs } from 'src/pagination/pagination.args';
import { UsersService } from 'src/users/users.service';
import { GetTeamsArgs } from './dto/getTeams.args';
import { Team } from './models/team.model';
import { TeamUserPopulated } from './models/team.user.model';
import { TeamsService } from './teams.service';

@Resolver((_of: unknown) => Team)
export class TeamsResolver {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private teamsService: TeamsService,
  ) {}

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

  @ResolveField(() => [TeamUserPopulated])
  async teamUserPopulated(@Parent() team: Team, @Args('id') id: number) {
    const user = await this.usersService.findOneById(99947);
    if (!user) {
      throw new InternalServerErrorException();
    }

    const teamUser = team.teamUsers.find(
      (curr) => curr.id === user.id.toString(),
    );
    if (!teamUser) {
      throw new InternalServerErrorException();
    }

    return [
      {
        ...user,
        isLeader: teamUser.isLeader,
        occurrence: teamUser.occurrence,
        projectUserId: teamUser.projectUserId,
      },
    ];
  }
}
