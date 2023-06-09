import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import { ScoreService } from 'src/api/score/score.service';
import type {
  IntDateRanged,
  StringDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type {
  LevelRecord,
  PersonalGeneralRoot,
  PreferredTime,
  PreferredTimeDateRanged,
  TeamInfo,
  UserScoreInfo,
} from './models/personal.general.model';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private cursusUserService: CursusUserService,
    private locationService: LocationService,
    private scoreService: ScoreService,
    private dateRangeService: DateRangeService,
  ) {}

  async findUserIdByLogin(login: string): Promise<number> {
    const cursusUser = await this.cursusUserService.findOneByLogin(login);

    return cursusUser.user.id;
  }

  async personalGeneralProfile(userId: number): Promise<PersonalGeneralRoot> {
    const userFullProfile = await this.cursusUserService.userFullProfile(
      userId,
    );

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
    const startOfMonth = new StatDate().startOfMonth();
    const nextMonth = startOfMonth.moveMonth(1);

    const dateRangeFilter = {
      createdAt: this.dateRangeService.aggrFilterFromDateRange({
        start: startOfMonth,
        end: nextMonth,
      }),
    };

    const scoreRank = await this.scoreService.scoreRank(dateRangeFilter);

    const me = scoreRank.find(({ userPreview }) => userPreview.id === userId);
    if (!me) {
      throw new NotFoundException();
    }

    const coalitionRank =
      scoreRank
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
    const logtime = await this.locationService.logtime(userId, dateRange);

    return this.dateRangeService.toDateRanged(logtime, dateRange);
  }

  async logtimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.logtimeByDateRange(userId, dateRange);
  }

  async preferredTime(userId: number): Promise<PreferredTime> {
    return await this.locationService.preferredTime(userId);
  }

  async preferredTimeByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<PreferredTimeDateRanged> {
    const dateFilter: FilterQuery<location> = {
      beginAt: { $lt: dateRange.end },
      endAt: { $gte: dateRange.start },
    };

    const preferredTime = await this.locationService.preferredTime(
      userId,
      dateFilter,
    );

    return this.dateRangeService.toDateRanged(preferredTime, dateRange);
  }

  async preferredTimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<PreferredTimeDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.preferredTimeByDateRange(userId, dateRange);
  }

  async preferredCluster(userId: number): Promise<string> {
    return await this.locationService.preferredCluster(userId);
  }

  async preferredClusterByDateRange(
    userId: number,
    dateRange: DateRange,
  ): Promise<StringDateRanged> {
    const dateFilter: FilterQuery<location> = {
      beginAt: { $lt: dateRange.end },
      endAt: { $gt: dateRange.start },
    };

    const preferredCluster = await this.locationService.preferredCluster(
      userId,
      dateFilter,
    );

    return this.dateRangeService.toDateRanged(preferredCluster, dateRange);
  }

  async preferredClusterByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<StringDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.preferredClusterByDateRange(userId, dateRange);
  }

  async teamInfo(userId: number): Promise<TeamInfo> {
    return {
      lastRegistered: 'avaj-launcher',
      lastPass: 'avaj-launcher',
      teams: [
        {
          id: 2966047,
          projectName: 'avaj-launcher',
          teamName: `jaham's team`,
          occurrence: 0,
          finalMark: 125,
          createdAt: new Date('2022-10-20T04:06:32.437Z'),
          lockedAt: new Date('2022-10-20T04:06:32.437Z'),
          closedAt: new Date('2022-10-20T16:26:30.317Z'),
          isValidated: true,
          finishedAt: new Date(),
          status: '완료',
        },
      ],
    };
  }

  async levelRecords(userId: number): Promise<LevelRecord[]> {
    return [
      {
        after: 0,
        userLevel: 2,
        averageLevel: 0,
      },
      {
        after: 50,
        userLevel: 3,
        averageLevel: 1,
      },
      {
        after: 100,
        userLevel: 3.34,
        averageLevel: 1.5,
      },
      {
        after: 150,
        userLevel: 3.34,
        averageLevel: 3,
      },
      {
        after: 200,
        userLevel: 4.1,
        averageLevel: 3.5,
      },
      {
        after: 250,
        userLevel: 5,
        averageLevel: 4,
      },
      {
        after: 300,
        userLevel: 6.3,
        averageLevel: 4.2,
      },
      {
        after: 350,
        userLevel: 7,
        averageLevel: 5,
      },
      {
        after: 400,
        userLevel: 7,
        averageLevel: 6,
      },
      {
        after: 450,
        userLevel: 8,
        averageLevel: 7,
      },
      {
        after: 500,
        userLevel: 8.8,
        averageLevel: 8,
      },
      {
        after: 550,
        userLevel: 11.38,
        averageLevel: 8.8,
      },
      {
        after: 600,
        userLevel: 11.38,
        averageLevel: 10,
      },
      {
        after: 650,
        userLevel: 11.38,
        averageLevel: 10.23,
      },
      {
        after: 700,
        userLevel: 11.38,
        averageLevel: 11,
      },
    ];
  }
}
