import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  aliveUserFilter,
  blackholedUserFilterByDateRange,
} from 'src/api/cursusUser/db/cursusUser.database.query';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { Landing } from './models/landing.model';

@Injectable()
export class LandingService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly projectsUserService: ProjectsUserService,
  ) {}

  @CacheOnReturn(DateWrapper.MIN * 10)
  async landing(): Promise<Landing> {
    const daysAfterBeginAt = Math.floor(
      DateWrapper.dateGap(new Date(), new Date('2020-01-20T00:00:00.000Z')) /
        DateWrapper.DAY,
    );

    const aliveCount = await this.cursusUserService.userCount(aliveUserFilter);

    const blackholedCount = await this.cursusUserService.userCount(
      blackholedUserFilterByDateRange(),
    );

    const memberCount = await this.cursusUserService.userCount({
      grade: 'Member',
    });

    const evalCount = await this.scaleTeamService.evalCount();

    const [trendingProject] =
      await this.projectsUserService.currRegisteredCountRanking(1);

    return {
      daysAfterBeginAt,
      aliveCount,
      blackholedCount,
      memberCount,
      evalCount,
      trendingProject,
    };
  }
}
