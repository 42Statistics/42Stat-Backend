import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import type { FilterQuery } from 'mongoose';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import type {
  IntDateRanged,
  StringDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { Time } from 'src/util';
import type {
  LevelGraphDateRanged,
  PersonalGeneral,
  PreferredTime,
  PreferredTimeDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import type {
  UserProfile,
  UserScoreRank,
} from './models/personal.general.userProfile.model';
import type { PersonalGeneralContext } from './personal.general.resolver';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private cursusUserService: CursusUserService,
    private coalitionsUserService: CoalitionsUserService,
    private locationService: LocationService,
    private dateRangeService: DateRangeService,
  ) {}

  async readTempLocation() {
    const ret = JSON.parse(
      await fs.readFile('/app/temp-data-store/jaham-location.json', {
        encoding: 'utf-8',
      }),
    );
    return ret;
  }

  async findUserIdByLogin(login: string): Promise<number> {
    const cursusUser = await this.cursusUserService.findOneByLogin(login);

    return cursusUser.user.id;
  }

  async selectUserId({
    context,
    login,
    userId,
  }: {
    context: PersonalGeneralContext;
    login?: string;
    userId?: number;
  }): Promise<number> {
    if (login) {
      const cursusUser = await this.cursusUserService.findOneByLogin(login);

      return cursusUser.user.id;
    }

    if (userId) {
      return userId;
    }

    return context.userId;
  }

  async personalGeneralProfile(
    userId: number,
  ): Promise<
    Pick<PersonalGeneral, 'userProfile' | 'beginAt' | 'blackholedAt' | 'wallet'>
  > {
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
      beginAt: { $lt: dateRange.start },
      endAt: { $gte: dateRange.end },
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

  async levelHistroy(userId: number): Promise<LevelGraphDateRanged> {
    const levelGraph = [
      {
        date: new Date('2022-01-01'),
        userLevel: 2,
        averageLevel: 3,
      },
      {
        date: new Date('2022-02-01'),
        userLevel: 3,
        averageLevel: 3,
      },
      {
        date: new Date('2022-03-01'),
        userLevel: 3.34,
        averageLevel: 3,
      },
      {
        date: new Date('2022-04-01'),
        userLevel: 3.34,
        averageLevel: 3,
      },
      {
        date: new Date('2022-05-01'),
        userLevel: 4.1,
        averageLevel: 3,
      },
      {
        date: new Date('2022-06-01'),
        userLevel: 5,
        averageLevel: 3,
      },
      {
        date: new Date('2022-07-01'),
        userLevel: 6.3,
        averageLevel: 3,
      },
      {
        date: new Date('2022-08-01'),
        userLevel: 7,
        averageLevel: 3,
      },
      {
        date: new Date('2022-09-01'),
        userLevel: 7,
        averageLevel: 3,
      },
      {
        date: new Date('2022-10-01'),
        userLevel: 8,
        averageLevel: 3,
      },
      {
        date: new Date('2022-11-01'),
        userLevel: 8.8,
        averageLevel: 3,
      },
      {
        date: new Date('2022-12-01'),
        userLevel: 11.38,
        averageLevel: 3,
      },
    ];

    return this.dateRangeService.toDateRanged(levelGraph, {
      start: new Date('2022'),
      end: new Date('2023'),
    });
  }

  async scoreInfo(userId: number): Promise<UserScoreRank> {
    const now = Time.now();
    const startOfMonth = Time.startOfMonth(now);
    const startOfNextMonth = Time.moveMonth(startOfMonth, 1);

    return await this.coalitionsUserService.userScoreRank(
      userId,
      startOfMonth,
      startOfNextMonth,
    );
  }
}
