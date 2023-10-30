import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUserService';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { promoFilter } from 'src/api/cursusUser/db/cursusUser.database.query';
import { ExperienceUserService } from 'src/api/experienceUser/experienceUser.service';
import { locationDateRangeFilter } from 'src/api/location/db/location.database.aggregate';
import type { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import { ScoreCacheService } from 'src/api/score/score.cache.service';
import { TeamService } from 'src/api/team/team.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate, type DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type {
  LevelRecord,
  PersonalGeneralRoot,
  PreferredCluster,
  PreferredClusterDateRanged,
  PreferredTime,
  PreferredTimeDateRanged,
  UserScoreInfo,
  UserTeamInfo,
} from './models/personal.general.model';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly locationService: LocationService,
    private readonly scoreCacheService: ScoreCacheService,
    private readonly teamService: TeamService,
    private readonly experineceUserService: ExperienceUserService,
    private readonly coalitionsUserService: CoalitionsUserService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  @CacheOnReturn()
  async personalGeneralProfile(userId: number): Promise<PersonalGeneralRoot> {
    const cachedUserFullProfile =
      await this.cursusUserCacheService.getUserFullProfile(userId);

    const userFullProfile =
      cachedUserFullProfile ??
      (await this.cursusUserService.findOneUserFullProfilebyUserId(userId));

    if (!userFullProfile) {
      throw new NotFoundException();
    }

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

    const coalitionsUser =
      await this.coalitionsUserService.findCoalitionsUserByUserIdAndLean(
        userId,
      );

    if (!coalitionsUser) {
      return {
        value: 0,
        rankInTotal: 0,
        rankInCoalition: 0,
      };
    }

    const scoreRank = await this.scoreCacheService.getScoreRank({
      dateTemplate,
      userId,
      coalitionId: coalitionsUser.coalitionId,
    });

    if (!scoreRank) {
      return {
        value: 0,
        rankInTotal: 0,
        rankInCoalition: 0,
      };
    }

    return {
      value: scoreRank.value,
      rankInTotal: scoreRank.rank,
      rankInCoalition: scoreRank.rank,
    };
  }

  private async logtimeByDateRange(
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

  @CacheOnReturn()
  async logtimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.logtimeByDateRange(userId, dateRange);
  }

  async logtimeRecords(userId: number, last: number): Promise<IntRecord[]> {
    const ret: IntRecord[] = [];
    const startDate = new DateWrapper().startOfMonth().moveMonth(1 - last);

    for (let i = 0; i < last; i++) {
      const currStartDate = startDate.moveMonth(i).toDate();
      const currEndDate = startDate.moveMonth(i + 1).toDate();

      const [curr] = await this.locationService.logtimeRanking(
        {
          start: currStartDate,
          end: currEndDate,
        },
        { 'user.id': userId },
      );

      ret.push({ at: currStartDate, value: curr?.value ?? 0 });
    }

    return ret;
  }

  private async preferredTime(
    userId: number,
    filter: FilterQuery<location>,
  ): Promise<PreferredTime> {
    return await this.locationService.preferredTime(userId, filter);
  }

  private async preferredTimeByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<PreferredTimeDateRanged> {
    const dateFilter = locationDateRangeFilter(dateRange);
    const preferredTime = await this.preferredTime(userId, dateFilter);

    return this.dateRangeService.toDateRanged(preferredTime, dateRange);
  }

  @CacheOnReturn()
  async preferredTimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<PreferredTimeDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.preferredTimeByDateRange(userId, dateRange);
  }

  private async preferredCluster(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<PreferredCluster> {
    const cluster = await this.locationService.preferredCluster(userId, filter);

    return {
      name: cluster,
    };
  }

  private async preferredClusterByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<PreferredClusterDateRanged> {
    const dateFilter = locationDateRangeFilter(dateRange);
    const preferredCluster = await this.preferredCluster(userId, dateFilter);

    return this.dateRangeService.toDateRanged(preferredCluster, dateRange);
  }

  @CacheOnReturn()
  async preferredClusterByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<PreferredClusterDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.preferredClusterByDateRange(userId, dateRange);
  }

  @CacheOnReturn()
  async teamInfo(userId: number): Promise<UserTeamInfo> {
    const userTeams = await this.teamService.userTeams(userId);

    const lastRegistered = [...userTeams]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .at(-1);

    const lastPassed = userTeams
      .filter((team) => team.isValidated === true)
      .at(0);

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

  @CacheOnReturn(DateWrapper.MIN * 10)
  async promoLevelRecords(beginAt: Date): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      ...promoFilter(beginAt),
    });
  }

  @CacheOnReturn(DateWrapper.MIN * 10)
  async promoMemberLevelRecords(beginAt: Date): Promise<LevelRecord[]> {
    return await this.experineceUserService.levelRecords(beginAt, {
      ...promoFilter(beginAt),
      grade: 'Member',
    });
  }
}
