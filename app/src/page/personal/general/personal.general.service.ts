import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { locationDateRangeFilter } from 'src/api/location/db/location.database.aggregate';
import type { location } from 'src/api/location/db/location.database.schema';
import { LocationCacheService } from 'src/api/location/location.cache.service';
import { LocationService } from 'src/api/location/location.service';
import type { project } from 'src/api/project/db/project.database.schema';
import { ProjectService } from 'src/api/project/project.service';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import {
  EVAL_COUNT_RANKING_TOTAL,
  ScaleTeamCacheService,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import {
  OUTSTANDING_FLAG_ID,
  ScaleTeamService,
} from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { TeamService } from 'src/api/team/team.service';
import { assertExist } from 'src/common/assertExist';
import { findUserRank } from 'src/common/findUserRank';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type {
  Character,
  CharacterEffort,
  CharacterTalent,
  LevelRecord,
  PersonalGeneralRoot,
  PreferredCluster,
  PreferredClusterDateRanged,
  PreferredTime,
  PreferredTimeDateRanged,
  TeamInfo,
  UserScoreInfo,
} from './models/personal.general.model';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private cursusUserService: CursusUserService,
    private cursusUserCacheService: CursusUserCacheService,
    private locationService: LocationService,
    private locationCacheService: LocationCacheService,
    private scoreService: ScoreService,
    private scoreCacheService: ScoreCacheService,
    private scaleTeamService: ScaleTeamService,
    private scaleTeamCacheService: ScaleTeamCacheService,
    private teamService: TeamService,
    private experineceUserService: ExperienceUserService,
    private projectService: ProjectService,
    private projectsUserService: ProjectsUserService,
    private dateRangeService: DateRangeService,
  ) {}

  async findUserIdByLogin(login: string): Promise<number> {
    const cursusUser = await this.cursusUserService.findOneByLogin(login);

    return cursusUser.user.id;
  }

  async personalGeneralProfile(userId: number): Promise<PersonalGeneralRoot> {
    const cachedUserFullProfile =
      await this.cursusUserCacheService.getUserFullProfileCacheByUserId(userId);

    const userFullProfile =
      cachedUserFullProfile ??
      (await this.cursusUserService.findOneUserFullProfilebyUserId(userId));

    const { cursusUser, coalition, titlesUsers } = userFullProfile;

    return {
      userProfile: {
        id: cursusUser.user.id,
        login: cursusUser.user.login,
        imgUrl: cursusUser.user.image.link,
        grade: cursusUser.grade ?? 'No Grade',
        level: cursusUser.level,
        displayname: cursusUser.user.displayname,
        coalition,
        titles: titlesUsers.map((titleUser) => ({
          titleId: titleUser.titleId,
          name: titleUser.titles.name,
          selected: titleUser.selected,
          createdAt: titleUser.createdAt,
          updatedAt: titleUser.updatedAt,
        })),
      },
      beginAt: cursusUser.beginAt,
      blackholedAt: cursusUser.blackholedAt,
      wallet: cursusUser.user.wallet,
    };
  }

  async scoreInfo(userId: number): Promise<UserScoreInfo> {
    const dateTemplate = DateTemplate.CURR_MONTH;

    const cachedScoreRanking =
      await this.scoreCacheService.getScoreRankingCacheByDateTemplate(
        dateTemplate,
      );

    const dateFilter = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange(
        this.dateRangeService.dateRangeFromTemplate(dateTemplate),
      ),
    };

    const scoreRanking =
      cachedScoreRanking ?? (await this.scoreService.scoreRanking(dateFilter));

    const me = scoreRanking.find(
      ({ userPreview }) => userPreview.id === userId,
    );
    if (!me) {
      throw new NotFoundException();
    }

    const coalitionRank =
      scoreRanking
        .filter(({ coalitionId }) => coalitionId === me?.coalitionId)
        .findIndex(({ userPreview }) => userPreview.id === userId) + 1;

    return {
      value: me.value,
      rankInTotal: me.rank,
      rankInCoalition: coalitionRank,
    };
  }

  async logtimeByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<IntDateRanged> {
    const logtimes = await this.locationService.logtimePerUserByDateRange(
      dateRange,
      {
        'user.id': userId,
      },
    );

    return this.dateRangeService.toDateRanged(
      logtimes.at(0)?.value ?? 0,
      dateRange,
    );
  }

  async logtimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.logtimeByDateRange(userId, dateRange);
  }

  async preferredTime(
    userId: number,
    filter: FilterQuery<location>,
  ): Promise<PreferredTime> {
    return await this.locationService.preferredTime(userId, filter);
  }

  async preferredTimeByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<PreferredTimeDateRanged> {
    const dateFilter = locationDateRangeFilter(dateRange);
    const preferredTime = await this.preferredTime(userId, dateFilter);

    return this.dateRangeService.toDateRanged(preferredTime, dateRange);
  }

  async preferredTimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<PreferredTimeDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.preferredTimeByDateRange(userId, dateRange);
  }

  async preferredCluster(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<PreferredCluster> {
    const cluster = await this.locationService.preferredCluster(userId, filter);

    return {
      name: cluster,
    };
  }

  async preferredClusterByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<PreferredClusterDateRanged> {
    const dateFilter = locationDateRangeFilter(dateRange);
    const preferredCluster = await this.preferredCluster(userId, dateFilter);

    return this.dateRangeService.toDateRanged(preferredCluster, dateRange);
  }

  async preferredClusterByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<PreferredClusterDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.preferredClusterByDateRange(userId, dateRange);
  }

  async teamInfo(userId: number): Promise<TeamInfo> {
    const userTeams = await this.teamService.userTeams(userId);

    const lastRegistered = [...userTeams]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .at(-1)?.projectPreview.name;

    const lastPassed = userTeams
      .filter((team) => team.isValidated === true)
      .at(0)?.projectPreview.name;

    return {
      lastRegistered,
      lastPassed,
      teams: userTeams,
    };
  }

  async levelRecords(
    filter?: FilterQuery<cursus_user>,
  ): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(filter);
  }

  async userLevelRecords(userId: number): Promise<LevelRecord[]> {
    return await this.levelRecords({ 'user.id': userId });
  }

  async memberLevelRecords(): Promise<LevelRecord[]> {
    return await this.levelRecords({ grade: 'Member' });
  }

  async character(userId: number): Promise<Character | null> {
    try {
      const examProjects = await this.projectService.findAll({
        filter: { exam: true },
        select: { id: 1 },
      });

      const evalCountRanking =
        await this.scaleTeamCacheService.getEvalCountRankingCache(
          EVAL_COUNT_RANKING_TOTAL,
        );

      assertExist(evalCountRanking);
      const evalCountRank = findUserRank(evalCountRanking, userId);
      assertExist(evalCountRank);

      return {
        effort: await this.characterEffort(userId, examProjects, evalCountRank),
        talent: await this.characterTalent(userId, examProjects, evalCountRank),
      };
    } catch (e) {
      return null;
    }
  }

  private async characterEffort(
    userId: number,
    examProjects: Pick<project, 'id'>[],
    evalCountRank: UserRank,
  ): Promise<CharacterEffort> {
    const logtimeRanking =
      await this.locationCacheService.getLogtimeRankingCacheByDateTemplate(
        DateTemplate.TOTAL,
      );

    assertExist(logtimeRanking);
    const logtimeRank = findUserRank(logtimeRanking, userId);
    assertExist(logtimeRank);

    const teams = await this.teamService.findAll({
      filter: {
        'users.id': userId,
        'validated?': { $ne: null },
      },
      select: { projectId: 1 },
    });

    const [projectTryCount, examTryCount] = teams.reduce(
      (acc, team) => [
        acc[0] + 1,
        acc[1] + Number(isExam(team.projectId, examProjects)),
      ],
      [0, 0],
    );

    return {
      logtimeRank,
      evalCountRank,
      examTryCount,
      projectTryCount,
    };
  }

  private async characterTalent(
    userId: number,
    examProjects: Pick<project, 'id'>[],
    evalCountRank: UserRank,
  ): Promise<CharacterTalent> {
    const levelRanking = await this.cursusUserCacheService.getUserRanking(
      USER_LEVEL_RANKING,
    );

    assertExist(levelRanking);
    const levelRank = findUserRank(levelRanking, userId);
    assertExist(levelRank);

    const projectsUsers = await this.projectsUserService.findAll({
      filter: { 'user.id': userId },
      select: {
        teams: 1,
        'validated?': 1,
        project: 1,
      },
    });

    const [examTotal, examOneShot, projectTotal, projectOneShot] =
      projectsUsers.reduce(
        (acc, projectsUser) => {
          const isOneShot = projectsUser.teams.at(0)?.['validated?'] === true;
          const isValidated = projectsUser['validated?'] !== null;

          if (isExam(projectsUser.project.id, examProjects)) {
            acc[0] += Number(isValidated);
            acc[1] += Number(isOneShot);
          }

          acc[2] += Number(isValidated);
          acc[3] += Number(isOneShot);

          return acc;
        },
        [0, 0, 0, 0],
      );

    const evalCount = evalCountRank.value;

    const outstandingCount = await this.scaleTeamService.evalCount({
      'correcteds.id': userId,
      'flag.id': OUTSTANDING_FLAG_ID,
    });

    return {
      levelRank,
      examOneshotRate: {
        total: examTotal,
        fields: [
          { key: 'oneShot', value: examOneShot },
          { key: 'retried', value: examTotal - examOneShot },
        ],
      },
      projectOneshotRate: {
        total: projectTotal,
        fields: [
          { key: 'oneShot', value: projectOneShot },
          { key: 'retried', value: projectTotal - projectOneShot },
        ],
      },
      outstandingRate: {
        total: evalCount,
        fields: [
          { key: 'outstanding', value: outstandingCount },
          { key: 'else', value: evalCount - outstandingCount },
        ],
      },
    };
  }
}

const isExam = (
  projectId: number,
  examProjects: Pick<project, 'id'>[],
): boolean => examProjects.find(({ id }) => id === projectId) !== undefined;
