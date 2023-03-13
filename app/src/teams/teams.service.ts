import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TeamsService {
  private readonly testTeams = [
    {
      id: 1,
      name: 'testTeam',
      finalMark: 123,
      lockedAt: new Date(),
      closedAt: new Date(),
      status: 'finished',
      isValidated: true,
      users: [
        {
          id: 1,
          login: 'testUser1',
          isLeader: true,
          occurrence: 1,
          projectUserId: 1,
        },
        {
          id: 2,
          login: 'testUser2',
          isLeader: false,
          occurrence: 0,
          projectUserId: 2,
        },
      ],
      projectId: 1,
      projectSessionId: 1,
      evals: 'asdf', // todo
    },
  ];

  async findById(id: number) {
    const result = this.testTeams.find((curr) => curr.id === id);
    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
