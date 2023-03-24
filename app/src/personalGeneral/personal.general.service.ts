import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { EvalUserDifficulty } from './models/personal.general.model';

@Injectable()
export class PersonalGeneralService {
  async readTempEval() {
    const ret = [];
    const r1 = await fs.readFile('/app/temp-data-store/jaham-as-corrector.json', { encoding: 'utf-8' });
    const d1 = JSON.parse(r1);
    ret.push(...d1);

    const r2 = await fs.readFile('/app/temp-data-store/jaham-as-corrected.json', { encoding: 'utf-8' });
    const d2 = JSON.parse(r2);
    ret.push(...d2);

    return ret;
  }

  async readTempLocation() {
    const ret = JSON.parse(await fs.readFile('/app/temp-data-store/jaham-location.json', { encoding: 'utf-8' }));
    return ret;
  }

  async readTempTemas() {
    const ret = JSON.parse(await fs.readFile('/app/temp-data-store/jaham-teams.json', { encoding: 'utf-8' }));
    return ret;
  }

  async readTempProjectUsers() {
    const ret = JSON.parse(await fs.readFile('/app/temp-data-store/jaham-projects-users.json', { encoding: 'utf-8' }));
    return ret;
  }

  async getEvalUserInfoByUid(uid: string) {
    const evals = await this.readTempEval();

    abstract class DesUser {
      id: string;
      login: string;
      imgUrl: string;
      score: number;
    }

    const pool: { [key: string]: DesUser } = {};

    evals.forEach((curr: any) => {
      if (curr.corrector.id === parseInt(uid)) {
        curr.correcteds.forEach((cur: any) => {
          if (!pool[cur.login]) {
            pool[cur.login] = {
              id: cur.id,
              login: cur.login,
              imgUrl: 'https://www.google.com',
              score: 0,
            };
          }
          pool[cur.login].score++;
        });
      } else {
        if (!pool[curr.corrector.login]) {
          pool[curr.corrector.login] = {
            id: curr.corrector.id,
            login: curr.corrector.login,
            imgUrl: 'https://www.google.com',
            score: 0,
          };
        }

        pool[curr.corrector.login].score++;
      }
    });

    return {
      totalEvalCnt: evals.length,
      difficulty: EvalUserDifficulty.MEDIUM,
      destinyUsers: Object.values(pool)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    };
  }

  async getLogtimeInfoByUid(uid: string) {
    const locations = await this.readTempLocation();

    const monthStart = new Date(new Date(new Date().setDate(1)).setHours(0, 0, 0, 0));
    const lastMonthStart = new Date(new Date(monthStart).setMonth(monthStart.getMonth() - 1));

    const currMonth = locations.filter(
      (curr: any) => new Date(curr.begin_at).getTime() > monthStart.getTime() && new Date(curr.end_at).getTime(),
    );
    const lastMonth = locations.filter(
      (curr: any) =>
        new Date(curr.end_at).getTime() < monthStart.getTime() &&
        new Date(curr.begin_at).getTime() > lastMonthStart.getTime() &&
        new Date(curr.end_at).getTime(),
    );

    return {
      currMonthLogtime: Math.floor(
        currMonth.reduce((acc: number, curr: any) => {
          return acc + (new Date(curr.end_at).getTime() - new Date(curr.begin_at).getTime());
        }, 0) /
          1000 /
          60 /
          60,
      ),
      lastMonthLogtime: Math.floor(
        lastMonth.reduce((acc: number, curr: any) => {
          return acc + (new Date(curr.end_at).getTime() - new Date(curr.begin_at).getTime());
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
      preferredCluster: 1,
    };
  }

  async getTeamInfoByUid(uid: string) {
    const projectUsers = await this.readTempProjectUsers();

    return {
      lastRegistered: 'avaj-launcher',
      lastPassed: 'avaj-launcher',
      teams: projectUsers.map((curr: any) => ({
        id: curr.id,
        name: curr.project.name,
        occurrence: curr.occurrence,
        closedAt: curr.marked_at ? new Date(curr.marked_at) : null,
        firstCreatedAt: new Date(curr.created_at),
        finalMark: curr.final_mark || null,
        isValidated: curr['validated?'],
      })),
    };
  }

  async getLevelHistroyByUid(uid: string) {
    return [
      {
        date: new Date('2022-01-01'),
        level: 2,
      },
      {
        date: new Date('2022-02-01'),
        level: 3,
      },
      {
        date: new Date('2022-03-01'),
        level: 3.34,
      },
      {
        date: new Date('2022-04-01'),
        level: 3.34,
      },
      {
        date: new Date('2022-05-01'),
        level: 4.1,
      },
      {
        date: new Date('2022-06-01'),
        level: 5,
      },
      {
        date: new Date('2022-07-01'),
        level: 6.3,
      },
      {
        date: new Date('2022-08-01'),
        level: 7,
      },
      {
        date: new Date('2022-09-01'),
        level: 7,
      },
      {
        date: new Date('2022-10-01'),
        level: 8,
      },
      {
        date: new Date('2022-11-01'),
        level: 8.8,
      },
      {
        date: new Date('2022-12-01'),
        level: 11.38,
      },
    ];
  }

  async getUserInfo(uid: string) {
    return {
      id: '99947',
      login: 'jaham',
      name: 'jaewon Ham',
      imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
      userTitles: [
        {
          id: '1',
          name: '%login, this is test title',
          isSelected: true,
        },
        {
          id: '2',
          name: 'this is test title 2, %login',
          isSelected: false,
        },
      ],
      level: 11.66,
      pooledAt: new Date('2021-11-08'),
      blackholedAt: null,
      wallet: 2022,
      correctionPoint: 42,
      scoreInfo: {
        current: 84,
        rankInCoalition: 91,
        rankInTotal: 589,
      },
    };
  }
}
