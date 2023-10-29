import { Injectable } from '@nestjs/common';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { ExperienceUserCacheService } from 'src/api/experienceUser/experienceUser.cache.service';
import type { quests_user } from 'src/api/questsUser/db/questsUser.database.schema';
import {
  COMMON_CORE_QUEST_ID,
  QuestsUserService,
} from 'src/api/questsUser/questsUser.service';
import { ScaleTeamCacheService } from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { TeamService } from 'src/api/team/team.service';
import { UserService } from 'src/api/user/user.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { UserTeam } from '../personal/general/models/personal.general.model';
import type { MyInfoRoot, MyRecentActivity } from './models/myInfo.model';

@Injectable()
export class MyInfoService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly questsUserService: QuestsUserService,
    private readonly teamService: TeamService,
    private readonly experienceUserCacheService: ExperienceUserCacheService,
    private readonly scoreCacheService: ScoreCacheService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
    private readonly userService: UserService,
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
        beginAt: cachedUserFullProfile.cursusUser.beginAt,
        level: cachedUserFullProfile.cursusUser.level,
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
  async myRecentActivity(
    myInfoRoot?: MyInfoRoot,
  ): Promise<MyRecentActivity | null> {
    // todo: isStudent 같은 field 를 제공하는 것도 방법일듯
    if (!myInfoRoot || !myInfoRoot.beginAt) {
      return null;
    }

    const userId = myInfoRoot.userPreview.id;

    const cachedUserFullProfile =
      await this.cursusUserCacheService.getUserFullProfile(userId);

    if (!cachedUserFullProfile) {
      return null;
    }

    const isNewMember = await this.isNewMember(userId);
    if (isNewMember === null) {
      return null;
    }

    return {
      isNewMember,
      lastValidatedTeam: (await this.lastValidatedTeam(userId)) ?? undefined,
      blackholedAt: cachedUserFullProfile.cursusUser.blackholedAt,
      experienceRank: await this.experienceRank(userId),
      scoreRank: await this.scoreRank(userId),
      evalCountRank: await this.evalCountRank(userId),
    };
  }

  // todo: deprecate 이후 안쓰는 함수 삭제 및 private method 로 변경
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
  async isNewMember(userId: number): Promise<boolean | null> {
    const questsUser: Pick<quests_user, 'validatedAt'> | null =
      await this.questsUserService.findOneAndLean({
        filter: {
          'user.id': userId,
          questId: COMMON_CORE_QUEST_ID,
        },
        select: { validatedAt: 1 },
      });

    if (!questsUser) {
      return null;
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
      await this.experienceUserCacheService.getExpIncreamentRank({
        dateTemplate: DateTemplate.CURR_WEEK,
        userId,
      });

    return cachedRank?.rank;
  }

  async scoreRank(userId: number): Promise<number | undefined> {
    const cachedRank = await this.scoreCacheService.getScoreRank({
      dateTemplate: DateTemplate.CURR_WEEK,
      userId,
    });

    return cachedRank?.rank;
  }

  async evalCountRank(userId: number): Promise<number | undefined> {
    const cachedRanking = await this.scaleTeamCacheService.getEvalCountRank({
      dateTemplate: DateTemplate.CURR_WEEK,
      userId,
    });

    return cachedRanking?.rank;
  }
}
