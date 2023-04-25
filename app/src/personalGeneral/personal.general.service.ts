import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { Time } from 'src/util';
import {
  LevelGraphDateRanged,
  LogtimeInfoDateRanged,
} from './models/personal.general.model';
import { UserGrade } from './models/personal.general.userProfile.model';

@Injectable()
export class PersonalGeneralService {
  async readTempLocation() {
    const ret = JSON.parse(
      await fs.readFile('/app/temp-data-store/jaham-location.json', {
        encoding: 'utf-8',
      }),
    );
    return ret;
  }

  async getLogtimeInfoByUid(uid: number): Promise<LogtimeInfoDateRanged> {
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

  async getTeamInfoByUid(uid: number) {
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

  async getLevelHistroyByUid(uid: number): Promise<LevelGraphDateRanged> {
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

  async getUserInfo(uid: number) {
    return {
      id: 99947,
      login: 'jaham',
      name: 'jaewon Ham',
      grade: UserGrade.MEMBER,
      imgUrl:
        'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
      titles: [
        {
          id: '1',
          name: "%login Officially Developer of 24HANE(42Seoul's attendance managing system)",
          isSelected: true,
        },
        {
          id: '2',
          name: '%login Librarian of Jiphyeonjeon :books:',
          isSelected: false,
        },
        {
          id: '3',
          name: 'Philanthropist %login',
          isSelected: false,
        },
      ],
      level: 11.66,
      pooledAt: new Date('2021-11-08'),
      blackholedAt: null,
      wallet: 2022,
      correctionPoint: 42,
      scoreInfo: {
        value: 84,
        rankInCoalition: 91,
        rankInTotal: 589,
      },
    };
  }
}
