import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { FilterQuery } from 'mongoose';
import { CoalitionsUserService } from 'src/api/coalitionsUser/coalitionsUser.service';
import {
  NumberDateRanged,
  StringDateRanged,
} from 'src/common/models/common.number.dateRanaged';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { LocationService } from 'src/api/location/location.service';
import { ScoreService } from 'src/api/score/score.service';
import { TitlesUserService } from 'src/api/titlesUser/titlesUser.service';
import { Time } from 'src/util';
import {
  LevelGraphDateRanged,
  PreferredTimeDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import {
  UserProfile,
  UserScoreRank,
} from './models/personal.general.userProfile.model';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private cursusUserService: CursusUserService,
    private titlesUserService: TitlesUserService,
    private scoreService: ScoreService,
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

  async currMonthLogtime(uid: number): Promise<NumberDateRanged> {
    //todo: same end and start: curr 에 1Ms 더해두면 겹칠
    const end = Time.curr();
    const start = Time.startOfMonth(end);

    const logtime = await this.locationService.logtime(uid, start, end);

    //todo: check other date ranged
    return generateDateRanged(logtime, end, start);
  }

  async lastMonthLogtime(uid: number): Promise<NumberDateRanged> {
    const lastMonth = Time.moveMonth(Time.curr(), -1);
    const start = Time.startOfMonth(lastMonth);
    const end = Time.moveMs(Time.moveMonth(start, 1), -1);

    const logtime = await this.locationService.logtime(uid, start, end);

    return generateDateRanged(logtime, end, start);
  }

  async preferredTime(
    uid: number,
    start?: Date,
    end?: Date,
  ): Promise<PreferredTimeDateRanged> {
    if (!start || !end) {
      //todo: same end and start
      end = Time.curr();
      start = Time.startOfMonth(end);
    }

    const preferredTime = await this.locationService.preferredTime(
      uid,
      start,
      end,
    );

    return generateDateRanged(preferredTime, start, end);
  }

  async preferredCluster(
    uid: number,
    start?: Date,
    end?: Date,
  ): Promise<StringDateRanged> {
    if (!start || !end) {
      //todo: same end and start
      end = Time.curr();
      start = Time.startOfMonth(end);
    }

    const preferredCluster = await this.locationService.preferredCluster(
      uid,
      start,
      end,
    );

    return generateDateRanged(preferredCluster, start, end);
  }

  async teamInfoById(uid: number): Promise<TeamInfo> {
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

  async levelHistroyById(uid: number): Promise<LevelGraphDateRanged> {
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

    return generateDateRanged(levelGraph, new Date('2022'), new Date('2023'));
  }

  async userInfo(uid: number): Promise<UserProfile> {
    const cursusUserProfile = await this.cursusUserService.cursusUserProfile(
      uid,
    );
    const titles = await this.titlesUserService.titlesUserProfile(uid);

    const userProfile: UserProfile = {
      ...cursusUserProfile,
      titles,
    };

    return userProfile;
  }

  async levelRank(
    uid: number,
    filter?: FilterQuery<cursus_user>,
  ): Promise<number> {
    return await this.cursusUserService.levelRankById(uid, filter);
  }

  async beginAt(uid: number): Promise<Date> {
    return new Date();
  }

  async blackholedAt(uid: number): Promise<Date> {
    return new Date();
  }

  async wallet(uid: number): Promise<number> {
    return 1234;
  }

  async scoreInfo(uid: number): Promise<UserScoreRank> {
    const currTime = Time.curr();
    const startOfMonth = Time.startOfMonth(currTime);
    const startOfNextMonth = Time.moveMonth(startOfMonth, 1);

    return await this.coalitionsUserService.scoreRankById(
      uid,
      startOfMonth,
      startOfNextMonth,
    );
  }
}
