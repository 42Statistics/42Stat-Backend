import { Injectable } from '@nestjs/common';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { ExperienceUserCacheService } from 'src/api/experienceUser/experienceUser.cache.service';
import { LocationCacheService } from 'src/api/location/location.cache.service';
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
    private readonly locationCacheService: LocationCacheService,
  ) {}

  async personalVersus(userId: number): Promise<PersonalVersus | null> {
    try {
      const levelRanking = await this.cursusUserCacheService.getUserRanking({
        keyBase: USER_LEVEL_RANKING,
      });

      const levelRank = await this.cursusUserCacheService.getUserRank({
        keyBase: USER_LEVEL_RANKING,
        userId,
      });

      const totalScoreRanking = await this.scoreCacheService.getScoreRanking({
        dateTemplate: DateTemplate.TOTAL,
      });

      const totalScoreRank = await this.scoreCacheService.getScoreRank({
        dateTemplate: DateTemplate.TOTAL,
        userId,
      });

      const totalEvalCountRanking =
        await this.scaleTeamCacheService.getEvalCountRanking({
          dateTemplate: DateTemplate.TOTAL,
        });

      const totalEvalCountRank =
        await this.scaleTeamCacheService.getEvalCountRank({
          dateTemplate: DateTemplate.TOTAL,
          userId,
        });

      const currMonthExpIncreamentRanking =
        await this.experienceUserCacheService.getExpIncreamentRanking({
          dateTemplate: DateTemplate.CURR_MONTH,
        });

      const currMonthExpIncreamentRank =
        await this.experienceUserCacheService.getExpIncreamentRank({
          dateTemplate: DateTemplate.CURR_MONTH,
          userId,
        });

      const currMonthScoreRanking =
        await this.scoreCacheService.getScoreRanking({
          dateTemplate: DateTemplate.CURR_MONTH,
        });

      const currMonthScoreRank = await this.scoreCacheService.getScoreRank({
        dateTemplate: DateTemplate.CURR_MONTH,
        userId,
      });

      const currMonthEvalCountRanking =
        await this.scaleTeamCacheService.getEvalCountRanking({
          dateTemplate: DateTemplate.CURR_MONTH,
        });

      const currMonthEvalCountRank =
        await this.scaleTeamCacheService.getEvalCountRank({
          dateTemplate: DateTemplate.CURR_MONTH,
          userId,
        });

      const totalLogtimeRank = await this.locationCacheService.getLogtimeRank(
        DateTemplate.TOTAL,
        userId,
      );

      assertExist(levelRanking);
      assertExist(levelRank);
      assertExist(totalScoreRanking);
      assertExist(totalScoreRank);
      assertExist(totalEvalCountRanking);
      assertExist(totalEvalCountRank);
      assertExist(currMonthExpIncreamentRanking);
      assertExist(currMonthExpIncreamentRank);
      assertExist(currMonthScoreRanking);
      assertExist(currMonthScoreRank);
      assertExist(currMonthEvalCountRanking);
      assertExist(currMonthEvalCountRank);
      assertExist(totalLogtimeRank);

      return {
        levelRankWithTotal: {
          ...levelRank,
          totalUserCount: levelRanking.length,
        },
        totalScoreRankWithTotal: {
          ...totalScoreRank,
          totalUserCount: totalScoreRanking.length,
        },
        totalEvalCountRankWithTotal: {
          ...totalEvalCountRank,
          totalUserCount: totalEvalCountRanking.length,
        },
        currMonthExpIncreamentRankWithTotal: {
          ...currMonthExpIncreamentRank,
          totalUserCount: currMonthExpIncreamentRanking.length,
        },
        currMonthScoreRankWithTotal: {
          ...currMonthScoreRank,
          totalUserCount: currMonthScoreRanking.length,
        },
        currMonthEvalCountRankWithTotal: {
          ...currMonthEvalCountRank,
          totalUserCount: currMonthEvalCountRanking.length,
        },
        totalLogtime: totalLogtimeRank.value,
      };
    } catch {
      return null;
    }
  }
}
