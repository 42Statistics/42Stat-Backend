import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { FilterQuery } from 'mongoose';
import { CoalitionsUserService } from 'src/coalitionsUser/coalitionsUser.service';
import { CursusUserService } from 'src/cursusUser/cursusUser.service';
import { cursus_user } from 'src/cursusUser/db/cursusUser.database.schema';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { ScoreService } from 'src/score/score.service';
import { TitlesUserService } from 'src/titlesUser/titlesUser.service';
import { Time } from 'src/util';
import {
  LevelGraphDateRanged,
  LogtimeInfoDateRanged,
  TeamInfo,
} from './models/personal.general.model';
import { UserProfile } from './models/personal.general.userProfile.model';

@Injectable()
export class PersonalGeneralService {
  constructor(
    private cursusUserService: CursusUserService,
    private titlesUserService: TitlesUserService,
    private scoreService: ScoreService,
    private coalitionsUserService: CoalitionsUserService,
  ) {}
  async readTempLocation() {
    const ret = JSON.parse(
      await fs.readFile('/app/temp-data-store/jaham-location.json', {
        encoding: 'utf-8',
      }),
    );
    return ret;
  }

  async getLogtimeInfoById(uid: number): Promise<LogtimeInfoDateRanged> {
    const locations = await this.readTempLocation();

    const monthStart = new Date(
      new Date(new Date().setDate(1)).setHours(0, 0, 0, 0),
    );
    const lastMonthStart = new Date(
      new Date(monthStart).setMonth(monthStart.getMonth() - 1),
    );

    const currMonth = locations.filter(
      (curr: any) =>
        new Date(curr.begin_at).getTime() > monthStart.getTime() &&
        new Date(curr.end_at).getTime(),
    );
    const lastMonth = locations.filter(
      (curr: any) =>
        new Date(curr.end_at).getTime() < monthStart.getTime() &&
        new Date(curr.begin_at).getTime() > lastMonthStart.getTime() &&
        new Date(curr.end_at).getTime(),
    );

    const logtimeInfo = {
      currMonthLogtime: Math.floor(
        currMonth.reduce((acc: number, curr: any) => {
          return (
            acc +
            (new Date(curr.end_at).getTime() -
              new Date(curr.begin_at).getTime())
          );
        }, 0) /
          1000 /
          60 /
          60,
      ),
      lastMonthLogtime: Math.floor(
        lastMonth.reduce((acc: number, curr: any) => {
          return (
            acc +
            (new Date(curr.end_at).getTime() -
              new Date(curr.begin_at).getTime())
          );
        }, 0) /
          1000 /
          60 /
          60,
      ),
      preferredTime: {
        morning: 123,
        daytime: 123,
        evening: 123,
        night: 123,
      },
      preferredCluster: 'c1',
    };

    return generateDateRanged(
      logtimeInfo,
      lastMonthStart,
      Time.moveDate(monthStart, -1),
    );
  }

  async getTeamInfoById(uid: number): Promise<TeamInfo> {
    return {
      lastRegistered: 'avaj-launcher',
      lastPass: 'avaj-launcher',
      teams: [
        {
          id: 2966047,
          name: 'avaj-launcher',
          occurrence: 0,
          closedAt: new Date('2022-10-20T16:26:30.317Z'),
          firstCreatedAt: new Date('2022-10-20T04:06:32.437Z'),
          finalMark: 125,
          isValidated: true,
        },
      ],
    };
  }

  async getLevelHistroyById(uid: number): Promise<LevelGraphDateRanged> {
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

  async getUserInfo(uid: number): Promise<UserProfile> {
    const currTime = Time.curr();
    const startOfMonth = Time.startOfMonth(currTime);
    const startOfNextMonth = Time.moveMonth(startOfMonth, 1);

    const cursusUserProfile = await this.cursusUserService.getCursusUserProfile(
      uid,
    );
    const titles = await this.titlesUserService.getTitlesUserProfile(uid);
    const scoreInfo = await this.coalitionsUserService.getScoreRankById(
      uid,
      startOfMonth,
      startOfNextMonth,
    );

    const userProfile: UserProfile = {
      ...cursusUserProfile,
      titles,
      scoreInfo,
    };

    return userProfile;
  }

  async getLevelRank(
    uid: number,
    filter?: FilterQuery<cursus_user>,
  ): Promise<number> {
    return await this.cursusUserService.getLevelRankById(uid, filter);
  }
}
