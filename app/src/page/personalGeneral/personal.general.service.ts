import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import type { FilterQuery } from 'mongoose';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import { TitlesUserService } from 'src/api/titlesUser/titlesUser.service';
import type {
  NumberDateRanged,
  StringDateRanged,
} from 'src/common/models/common.number.dateRanaged';
import {
  dateRangeFromTemplate,
  generateDateRanged,
} from 'src/dateRange/dateRange.service';
import { DateRangeArgs, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { Time } from 'src/util';
import type {
  LevelGraphDateRanged,
  PreferredTime,
  PreferredTimeDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import type {
  UserProfile,
  UserScoreRank,
} from './models/personal.general.userProfile.model';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private cursusUserService: CursusUserService,
    private titlesUserService: TitlesUserService,
    private coalitionsUserService: CoalitionsUserService,
    private locationService: LocationService,
  ) {}
  async readTempLocation() {
    const ret = JSON.parse(
      await fs.readFile('/app/temp-data-store/jaham-location.json', {
        encoding: 'utf-8',
      }),
    );
    return ret;
  }

  async currMonthLogtime(userId: number): Promise<NumberDateRanged> {
    const dateRange = dateRangeFromTemplate(DateTemplate.CURR_MONTH);
    const logtime = await this.locationService.logtime(userId, dateRange);

    //todo: check other date ranged
    return generateDateRanged(logtime, dateRange);
  }

  async lastMonthLogtime(userId: number): Promise<NumberDateRanged> {
    const dateRange = dateRangeFromTemplate(DateTemplate.LAST_MONTH);

    const logtime = await this.locationService.logtime(userId, dateRange);

    return generateDateRanged(logtime, dateRange);
  }

  async preferredTime(userId: number): Promise<PreferredTime> {
    return await this.locationService.preferredTime(userId);
  }

  async preferredTimeByDateRange(
    userId: number,
    dateRange: DateRangeArgs,
  ): Promise<PreferredTimeDateRanged> {
    const dateFilter: FilterQuery<location> = {
      beginAt: { $lt: dateRange.start },
      endAt: { $gte: dateRange.end },
    };

    const preferredTime = await this.locationService.preferredTime(
      userId,
      dateFilter,
    );

    return generateDateRanged(preferredTime, dateRange);
  }

  async preferredCluster(userId: number): Promise<string> {
    return await this.locationService.preferredCluster(userId);
  }

  async preferredClusterByDateRange(
    userId: number,
    dateRange: DateRangeArgs,
  ): Promise<StringDateRanged> {
    const dateFilter: FilterQuery<location> = {
      beginAt: { $lt: dateRange.end },
      endAt: { $gt: dateRange.start },
    };

    const preferredCluster = await this.locationService.preferredCluster(
      userId,
      dateFilter,
    );

    return generateDateRanged(preferredCluster, dateRange);
  }

  async userTeamInfo(userId: number): Promise<TeamInfo> {
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

  async userLevelHistroy(userId: number): Promise<LevelGraphDateRanged> {
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

    return generateDateRanged(levelGraph, {
      start: new Date('2022'),
      end: new Date('2023'),
    });
  }

  async userInfo(userId: number): Promise<UserProfile> {
    const cursusUserProfile = await this.cursusUserService.cursusUserProfile(
      userId,
    );
    const titles = await this.titlesUserService.titlesUserProfile(userId);

    const userProfile: UserProfile = {
      ...cursusUserProfile,
      titles,
    };

    return userProfile;
  }

  async levelRank(
    userId: number,
    filter?: FilterQuery<cursus_user>,
  ): Promise<number> {
    return await this.cursusUserService.userLevelRank(userId, filter);
  }

  async beginAt(userId: number): Promise<Date> {
    return new Date();
  }

  async blackholedAt(userId: number): Promise<Date> {
    return new Date();
  }

  async wallet(userId: number): Promise<number> {
    return 1234;
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
