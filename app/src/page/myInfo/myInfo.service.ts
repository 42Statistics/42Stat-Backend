import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import type { experience_user } from 'src/api/experienceUser/db/experienceUser.database.schema';
import { ExperienceUserCacheService } from 'src/api/experienceUser/experienceUser.cache.service';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import type { quests_user } from 'src/api/questsUser/db/questsUser.database.schema';
import {
  COMMON_CORE_QUEST_ID,
  QuestsUserService,
} from 'src/api/questsUser/questsUser.service';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamCacheService } from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { scoreDateRangeFilter } from 'src/api/score/db/score.database.aggregate';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { TeamService } from 'src/api/team/team.service';
import { UserService } from 'src/api/user/user.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { findUserRank } from 'src/common/findUserRank';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { UserTeam } from '../personal/general/models/personal.general.model';
import type { MyInfoRoot } from './models/myInfo.model';

@Injectable()
export class MyInfoService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly questsUserService: QuestsUserService,
    private readonly teamService: TeamService,
    private readonly experienceUserService: ExperienceUserService,
    private readonly experienceUserCacheService: ExperienceUserCacheService,
    private readonly scoreService: ScoreService,
    private readonly scoreCacheService: ScoreCacheService,
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
    private readonly userService: UserService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  @CacheOnReturn()
  async myInfoRoot(userId: number): Promise<MyInfoRoot | null> {
    const cachedUserFullProfile =
      await this.cursusUserCacheService.getUserFullProfile(userId);

    if (cachedUserFullProfile) {
      return {
        userPreview: {
          id: cachedUserFullProfile.cursusUser.user.id,
          login: cachedUserFullProfile.cursusUser.user.login,
          imgUrl: cachedUserFullProfile.cursusUser.user.image.link,
        },
        displayname: cachedUserFullProfile.cursusUser.user.displayname,
      };
    }

    const user: {
      id: number;
      login: string;
      image: { link?: string };
      displayname: string;
    } | null = await this.userService.findOneAndLean({
      filter: { id: userId },
      select: {
        id: 1,
        login: 1,
        'image.link': 1,
        displayname: 1,
      },
    });

    if (user) {
      return {
        userPreview: {
          id: user.id,
          login: user.login,
          imgUrl: user.image.link,
        },
        displayname: user.displayname,
      };
    }

    return null;
  }

  @CacheOnReturn()
  async blackholedAt(userId: number): Promise<Date | null> {
    const cachedUserFullProfile =
      await this.cursusUserCacheService.getUserFullProfile(userId);

    const cursusUser: Pick<cursus_user, 'blackholedAt'> | null =
      cachedUserFullProfile?.cursusUser ??
      (await this.cursusUserService.findOneAndLean({
        filter: { 'user.id': userId },
        select: { blackholedAt: 1 },
      }));

    return cursusUser?.blackholedAt ?? null;
  }

  @CacheOnReturn()
  async isNewMember(userId: number): Promise<boolean> {
    const questsUser: Pick<quests_user, 'validatedAt'> | null =
      await this.questsUserService.findOneAndLean({
        filter: {
          'user.id': userId,
          questId: COMMON_CORE_QUEST_ID,
        },
        select: { validatedAt: 1 },
      });

    if (!questsUser) {
      throw new NotFoundException();
    }

    if (!questsUser.validatedAt) {
      return false;
    }

    const dateGap = Math.floor(
      DateWrapper.dateGap(new Date(), questsUser.validatedAt) / DateWrapper.DAY,
    );

    return dateGap < 8;
  }

  @CacheOnReturn()
  async lastValidatedTeam(userId: number): Promise<UserTeam | null> {
    const userTeams = await this.teamService.userTeams(userId);

    const lastValidatedTeam = userTeams
      .filter((team) => team.isValidated === true)
      .at(0);

    if (!lastValidatedTeam) {
      return null;
    }

    return lastValidatedTeam;
  }

  async experienceRank(userId: number): Promise<number | undefined> {
    const cachedRank =
      await this.experienceUserCacheService.getExpIncreamentRank(
        DateTemplate.CURR_WEEK,
        userId,
      );

    if (cachedRank) {
      return cachedRank.rank;
    }

    const dateRange = this.dateRangeService.dateRangeFromTemplate(
      DateTemplate.CURR_WEEK,
    );

    const dateFilter: FilterQuery<experience_user> = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const expIncreamentRanking =
      await this.experienceUserService.increamentRanking(dateFilter);

    return findUserRank(expIncreamentRanking, userId)?.rank;
  }

  async scoreRank(userId: number): Promise<number | undefined> {
    const cachedRank = await this.scoreCacheService.getScoreRank(
      DateTemplate.CURR_WEEK,
      userId,
    );

    if (cachedRank) {
      return cachedRank.rank;
    }

    const dateRange = this.dateRangeService.dateRangeFromTemplate(
      DateTemplate.CURR_WEEK,
    );

    const ranking = await this.scoreService.scoreRanking({
      filter: scoreDateRangeFilter(dateRange),
    });

    return findUserRank(ranking, userId)?.rank;
  }

  async evalCountRank(userId: number): Promise<number | undefined> {
    const cachedRanking = await this.scaleTeamCacheService.getEvalCountRank(
      DateTemplate.CURR_WEEK,
      userId,
    );

    if (cachedRanking) {
      return cachedRanking.rank;
    }

    const dateRange = this.dateRangeService.dateRangeFromTemplate(
      DateTemplate.CURR_WEEK,
    );

    const dateFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const evalCountRanking = await this.scaleTeamService.evalCountRanking(
      dateFilter,
    );

    return findUserRank(evalCountRanking, userId)?.rank;
  }
}
