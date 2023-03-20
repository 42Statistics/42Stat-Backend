import { Injectable } from '@nestjs/common';
import { Team } from './models/team.model';

@Injectable()
export class TeamsService {
  private testTeam: Team;

  constructor() {
    this.testTeam = {
      id: '1',
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
      isValidated: null,
      projectSessionId: '1',
      teamScaleTeamsPartial: [
        {
          id: '1',
          scaleId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          feedback: 'zz',
          comment: 'asdf',
          finalMark: 123,
          flag: 'testFlag',
          beginAt: new Date(),
          correcteds: null,
          corrector: null,
          filledAt: new Date(),
        },
      ],
    };
  }

  // todo: mongoose.objectid 로 id 타입 전부 바꿔야할지도....
  // todo
  // eslint-disable-next-line
  async getTeamById(id: string) {
    return {
      ...this.testTeam,
      usersPopulated: 'testUserPoped',
      projectPopulated: 'testProjectPoped',
    };
  }

  // todo
  // eslint-disable-next-line
  async getTeamPopulatedById(id: string) {
    return this.testTeam;
  }

  // todo
  // eslint-disable-next-line
  async getTeamsPopulatedByIds(ids: number[]) {
    return [this.testTeam];
  }
}
