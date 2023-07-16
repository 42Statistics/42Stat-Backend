import { Injectable } from '@nestjs/common';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { ExperienceUserCacheService } from 'src/api/experienceUser/experienceUser.cache.service';
import { ScaleTeamCacheService } from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { assertExist } from 'src/common/assertExist';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PersonalVersus } from './models/personal.versus.model';

@Injectable()
export class PersonalVersusService {
  constructor(
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly experienceUserCacheService: ExperienceUserCacheService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
    private readonly scoreCacheService: ScoreCacheService,
  ) {}

  async personalVersus(userId: number): Promise<PersonalVersus | null> {
    try {
      const levelRank = await this.cursusUserCacheService.getUserRank(
        USER_LEVEL_RANKING,
        userId,
      );

      assertExist(levelRank);

      const totalScoreRank = await this.scoreCacheService.getScoreRank(
        DateTemplate.TOTAL,
        userId,
      );

      assertExist(totalScoreRank);

      const totalEvalCountRank =
        await this.scaleTeamCacheService.getEvalCountRank(
          DateTemplate.TOTAL,
          userId,
        );

      assertExist(totalEvalCountRank);

      const currWeekExpIncreamentRank =
        await this.experienceUserCacheService.getExpIncreamentRank(
          DateTemplate.CURR_WEEK,
          userId,
        );

      assertExist(currWeekExpIncreamentRank);

      const currWeekScoreRank = await this.scoreCacheService.getScoreRank(
        DateTemplate.CURR_WEEK,
        userId,
      );

      assertExist(currWeekScoreRank);

      const currWeekEvalCountRank =
        await this.scaleTeamCacheService.getEvalCountRank(
          DateTemplate.CURR_WEEK,
          userId,
        );

      assertExist(currWeekEvalCountRank);

      return {
        levelRank,
        totalScoreRank,
        totalEvalCountRank,
        currWeekExpIncreamentRank,
        currWeekScoreRank,
        currWeekEvalCountRank,
      };
    } catch {
      return null;
    }
  }
}
