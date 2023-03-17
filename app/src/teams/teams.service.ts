import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamsService {
  // todo: mongoose.objectid 로 id 타입 전부 바꿔야할지도....
  // todo
  // eslint-disable-next-line
  async getTeamById(id: string) {
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
          isLeader: true,
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
      usersPopulated: 'testUserPoped',
      projectPopulated: 'testProjectPoped',
    };
  }

  // todo
  // eslint-disable-next-line
  async getTeamPopulatedById(id: string) {
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

  // todo
  // eslint-disable-next-line
  async getTeamsPopulatedByIds(ids: number[]) {
    return [
      {
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
      },
    ];
  }
}
