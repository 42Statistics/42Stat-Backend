import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  aliveUserFilter,
  blackholedUserFilter,
} from 'src/api/cursusUser/db/cursusUser.database.query';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { StatDate } from 'src/statDate/StatDate';
import type { Landing } from './models/landing.model';

@Injectable()
export class LandingService {
  constructor(
    private cursusUserService: CursusUserService,
    private scaleTeamService: ScaleTeamService,
  ) {}

  async landing(): Promise<Landing> {
    const daysAfterBeginAt = Math.floor(
      StatDate.dateGap(
        new StatDate(),
        new StatDate('2020-01-20T00:00:00.000Z'),
      ) / StatDate.DAY,
    );

    const aliveCount = await this.cursusUserService.userCount(aliveUserFilter);

    const blackholedCount = await this.cursusUserService.userCount(
      blackholedUserFilter,
    );

    const memberCount = await this.cursusUserService.userCount({
      grade: 'Member',
    });

    const evalCount = await this.scaleTeamService.evalCount();

    return {
      daysAfterBeginAt,
      aliveCount,
      blackholedCount,
      memberCount,
      evalCount,
    };
  }
}
