import { Injectable } from '@nestjs/common';
import { ScaleTeam } from './models/scaleTeam.model';

@Injectable()
export class ScaleTeamsService {
  private testScaleTeam: ScaleTeam;

  constructor() {
    this.testScaleTeam = {
      id: '1',
      scaleId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      beginAt: new Date(),
      filledAt: new Date(),
      finalMark: 123,
      flag: 'testFlag(OK)',
      correcteds: [
        {
          id: 99947,
          login: 'jaham',
        },
      ],
      feedback: 'this is feedback',
      corrector: {
        id: 99947,
        login: 'jaham',
      },
      comment: 'this is comment',
      scales: 'testScale',
      scaleTeamTeamPartial: {
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
        isValidated: true,
        projectSessionId: '1',
      },
    };
  }

  // todo
  // eslint-disalbe-next-line
  async findById(id: string) {
    return this.testScaleTeam;
  }
}
