import { forwardRef, Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Team } from 'src/teams/models/team.model';
import { TeamsService } from 'src/teams/teams.service';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver((_of: unknown) => User)
export class UserResolver {
  constructor(
    @Inject(forwardRef(() => TeamsService))
    private teamsService: TeamsService,
    private usersService: UsersService,
  ) {}

  @Query((_returns) => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  @ResolveField()
  async id(@Parent() user: User) {
    return user.id;
  }

  @ResolveField(() => [Team], { nullable: 'items' })
  // todo
  // eslint-disable-next-line
  async teams(@Parent() user: User) {
    const teams = await this.teamsService.getTeamById('1');
    return [teams];
  }
}
