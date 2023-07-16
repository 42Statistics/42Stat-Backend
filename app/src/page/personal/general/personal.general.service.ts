import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { promoFilter } from 'src/api/cursusUser/db/cursusUser.database.query';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { locationDateRangeFilter } from 'src/api/location/db/location.database.aggregate';
import type { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { ScoreService } from 'src/api/score/score.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type {
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
    private scoreService: ScoreService,
    private scoreCacheService: ScoreCacheService,
    private teamService: TeamService,
    private experineceUserService: ExperienceUserService,
    private dateRangeService: DateRangeService,
  ) {}

  @CacheOnReturn()
  async findUserIdByLogin(login: string): Promise<number> {
    const cursusUser = await this.cursusUserService.findOneByLogin(login);

    return cursusUser.user.id;
  }

  @CacheOnReturn()
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

    const rankInCoalition = me.coalition
      ? scoreRanking
          .filter(
            ({ coalition }) => coalition && coalition.id === me.coalition?.id,
          )
          .findIndex(({ userPreview }) => userPreview.id === userId) + 1
      : undefined;

    return {
      value: me.value,
      rankInTotal: me.rank,
      rankInCoalition,
    };
  }

  @CacheOnReturn()
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

  @CacheOnReturn()
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

  @CacheOnReturn()
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

  @CacheOnReturn()
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

  @CacheOnReturn()
  async userLevelRecords(
    userId: number,
    beginAt: Date,
  ): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      'user.id': userId,
    });
  }

  @CacheOnReturn()
  async promoLevelRecords(beginAt: Date): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      ...promoFilter(new StatDate(beginAt)),
    });
  }

  @CacheOnReturn()
  async promoMemberLevelRecords(beginAt: Date): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      ...promoFilter(new StatDate(beginAt)),
      grade: 'Member',
    });
  }
}
