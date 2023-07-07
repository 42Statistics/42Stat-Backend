import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import {
  CursusUserCacheService,
  USER_LEVEL_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { promoFilter } from 'src/api/cursusUser/db/cursusUser.database.query';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { locationDateRangeFilter } from 'src/api/location/db/location.database.aggregate';
import type { location } from 'src/api/location/db/location.database.schema';
import { LocationCacheService } from 'src/api/location/location.cache.service';
import { LocationService } from 'src/api/location/location.service';
import type { project } from 'src/api/project/db/project.database.schema';
import { ProjectService } from 'src/api/project/project.service';
import { ProjectsUserService } from 'src/api/projectsUser/projectsUser.service';
import { ScaleTeamCacheService } from 'src/api/scaleTeam/scaleTeam.cache.service';
import {
  OUTSTANDING_FLAG_ID,
  ScaleTeamService,
} from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { TeamService } from 'src/api/team/team.service';
import { assertExist } from 'src/common/assertExist';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
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
      await this.cursusUserCacheService.getUserFullProfile(userId);

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

    const scoreRankingCache = await this.scoreCacheService.getScoreRanking(
      dateTemplate,
    );

    const dateFilter = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange(
        this.dateRangeService.dateRangeFromTemplate(dateTemplate),
      ),
    };

    const scoreRanking =
      scoreRankingCache ?? (await this.scoreService.scoreRanking(dateFilter));

    const me = scoreRanking.find(
      ({ userPreview }) => userPreview.id === userId,
    );

    if (!me) {
      throw new NotFoundException();
    }

    const coalitionRank =
      scoreRanking
        .filter(({ coalition }) => coalition.id === me.coalition.id)
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
    const logtimes = await this.locationService.logtimeRanking(dateRange, {
      'user.id': userId,
    });

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

  async userLevelRecords(
    userId: number,
    beginAt: Date,
  ): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      'user.id': userId,
    });
  }

  async promoLevelRecords(beginAt: Date): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      ...promoFilter(new StatDate(beginAt)),
    });
  }

  async promoMemberLevelRecords(beginAt: Date): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      ...promoFilter(new StatDate(beginAt)),
      grade: 'Member',
    });
  }

  async character(userId: number): Promise<Character | null> {
    try {
      const examProjectIds: { id: number }[] =
        await this.projectService.findAll({
          filter: { exam: true },
          select: { id: 1 },
        });

      return {
        effort: await this.characterEffort(userId, examProjectIds),
        talent: await this.characterTalent(userId, examProjectIds),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async characterEffort(
    userId: number,
    examProjects: Pick<project, 'id'>[],
  ): Promise<CharacterEffort> {
    const logtimeRank = await this.locationCacheService.getLogtimeRank(
      DateTemplate.TOTAL,
      userId,
    );

    assertExist(logtimeRank);

    const evalCountRankCache =
      await this.scaleTeamCacheService.getEvalCountRank(
        DateTemplate.TOTAL,
        userId,
      );

    assertExist(evalCountRankCache);

    const evalCountRank = evalCountRankCache;

    const teamProjectIds: { projectId: number }[] =
      await this.teamService.findAll({
        filter: {
          'users.id': userId,
          'validated?': { $ne: null },
        },
        select: { projectId: 1 },
      });

    const { projectTryCount, examTryCount } = teamProjectIds.reduce(
      (acc, team) => {
        acc.projectTryCount++;
        acc.examTryCount += Number(isExam(team.projectId, examProjects));

        return acc;
      },
      { projectTryCount: 0, examTryCount: 0 },
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
  ): Promise<CharacterTalent> {
    const levelRank = await this.cursusUserCacheService.getUserRank(
      USER_LEVEL_RANKING,
      userId,
    );

    assertExist(levelRank);

    const projectsUsers: {
      teams: { 'validated?'?: boolean }[];
      project: { id: number };
    }[] = await this.projectsUserService.findAll({
      filter: { 'user.id': userId, 'validated?': { $ne: null } },
      select: {
        'teams.validated?': 1,
        'project.id': 1,
      },
    });

    const { examTotal, examOneShot, projectTotal, projectOneShot } =
      projectsUsers.reduce(
        (acc, projectsUser) => {
          const isOneShot = projectsUser.teams.at(0)?.['validated?'] === true;

          if (isExam(projectsUser.project.id, examProjects)) {
            acc.examTotal++;
            acc.examOneShot += Number(isOneShot);
          }

          acc.projectTotal++;
          acc.projectOneShot += Number(isOneShot);

          return acc;
        },
        { examTotal: 0, examOneShot: 0, projectTotal: 0, projectOneShot: 0 },
      );

    const evalCount = await this.scaleTeamService.evalCount({
      'correcteds.id': userId,
    });

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
