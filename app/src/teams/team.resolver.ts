import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { GetTeamsArgs } from './dto/getTeams.args';
import { Team } from './models/team.model';

@Resolver((_of: unknown) => Team)
export class TeamResolver {
  @Query((_returns) => Team)
  // todo
  // eslint-disable-next-line
  async getTeamById(@Args('id', { type: () => ID }) id: string) {
    return {
      id: 1,
      name: 'testTeam',
      finalMark: null,
      projectId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'finished',
      terminatingAt: null,
      teamUsers: [
        {
          id: '99947',
          login: 'jaham',
          leader: true,
          occurrence: 0,
          projectUserId: '1',
        },
      ],
      isLocked: true,
      isClosed: true,
      lockedAt: new Date(),
      closedAt: new Date(),
      projectSessionId: '1',
      teamScaleTeams: [
        {
          id: '1',
          scaleId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          feedback: 'zz',
          finalMark: 123,
          flag: 'testFlag',
          beginAt: new Date(),
          correcteds: 'testUser',
          corrector: 'testUser',
          filledAt: new Date(),
        },
      ],
    };
  }

  // todo: pagenated type 설정
  @Query((_returns) => [Team], { nullable: 'items' })
  async getTeams(@Args() args: GetTeamsArgs) {
    console.log(args);
    return [];
  }
}
