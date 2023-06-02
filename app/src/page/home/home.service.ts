import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import {
  ValuePerCoalition,
  CoalitionScoreRecords,
} from 'src/api/score/models/score.coalition.model';
import { ScoreService } from 'src/api/score/score.service';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { UserRanking } from 'src/common/models/common.user.model';
import { generateDateRanged } from 'src/dateRange/dateRange.service';
import { Time } from 'src/util';
import {
  UserCountPerLevels,
  ValuePerCircle,
  ValueRecord,
} from './models/home.model';

@Injectable()
export class HomeService {
  constructor(
    private cursusUserService: CursusUserService,
    private scaleTeamService: ScaleTeamService,
    private scoreService: ScoreService,
    private questsUserService: QuestsUserService,
  ) {}

  async currWeekEvalCount(): Promise<NumberDateRanged> {
    const curr = Time.curr();
    const currWeek = Time.startOfWeek(Time.curr());

    const evalCount = await this.scaleTeamService.evalCount({
      beginAt: { $gte: currWeek, $lt: curr },
      filledAt: { $ne: null }, //todo: check filter
    });

    return generateDateRanged(evalCount, currWeek, Time.moveDate(curr, -1));
  }

  async lastWeekEvalCount(): Promise<NumberDateRanged> {
    const currWeek = Time.startOfWeek(Time.curr());
    const lastWeek = Time.moveWeek(currWeek, -1);

    const evalCount = await this.scaleTeamService.evalCount({
      beginAt: { $gte: lastWeek, $lt: currWeek },
      filledAt: { $ne: null },
    });

    return generateDateRanged(evalCount, lastWeek, Time.moveDate(currWeek, -1));
  }

  async currMonthBlackholedCount(): Promise<NumberDateRanged> {
    const curr = Time.curr();
    const currMonth = Time.startOfMonth(curr);

    const blackholedCount = await this.cursusUserService.countPerMonth(
      currMonth,
      curr,
      'blackholedAt',
    );

    return generateDateRanged(
      Time.getValueByDate(currMonth, blackholedCount),
      currMonth,
      curr,
    );
  }

  async lastMonthBlackholedCount(): Promise<NumberDateRanged> {
    const currMonth = Time.startOfMonth(Time.curr());
    const lastMonth = Time.moveMonth(currMonth, -1);

    const blackholedCount = await this.cursusUserService.countPerMonth(
      lastMonth,
      currMonth,
      'blackholedAt',
    );

    return generateDateRanged(
      Time.getValueByDate(lastMonth, blackholedCount),
      lastMonth,
      currMonth,
    );
  }

  async totalScores(): Promise<ValuePerCoalition[]> {
    return await this.scoreService.scoresByCoalition();
  }

  async scoreRecords(): Promise<CoalitionScoreRecords[]> {
    // todo: 고정 코알리숑 아이디
    const coalitionIds = [85, 86, 87, 88];

    const currMonth = Time.startOfMonth(Time.curr());
    const lastYear = Time.moveYear(currMonth, -1);

    return await this.scoreService.scoreRecords({
      createdAt: { $gte: lastYear, $lt: currMonth },
      coalitionsUserId: { $ne: null },
      coalitionId: { $in: coalitionIds },
    });
  }

  async totalEvalCount(): Promise<number> {
    return await this.scaleTeamService.evalCount();
  }

  async averageFeedbackLength(): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback');
  }

  async averageCommentLength(): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment');
  }

  async userCountPerLevels(): Promise<UserCountPerLevels[]> {
    return await this.cursusUserService.userCountPerLevels();
  }

  async walletRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.rank('user.wallet', limit);
  }

  async correctionPointRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.rank('user.correctionPoint', limit);
  }

  async averageCircleDurations(userId?: number): Promise<ValuePerCircle[]> {
    return await this.questsUserService.averageCircleDurations(userId);
  }

  //async averageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  return await this.questsUserService.getAverageCircleDurationsByPromo();
  //}

  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.cursusUserService.blackholedCountPerCircles();
  }

  async activeUserCountRecords(): Promise<ValueRecord[]> {
    const curr = Time.curr();
    const nextMonth = Time.startOfMonth(Time.moveMonth(curr, 1));
    const lastYear = Time.moveYear(nextMonth, -1);

    const newPromoCounts = await this.cursusUserService.countPerMonth(
      lastYear,
      curr,
      'beginAt',
    );

    const blackholedCounts = await this.cursusUserService.countPerMonth(
      lastYear,
      curr,
      'blackholedAt',
    );

    let activeUserCount = 0;

    const dates = Time.partitionByMonth(lastYear, curr);

    return dates
      .map((date, index): ValueRecord => {
        const newPromo = Time.getValueByDate(date, newPromoCounts);
        const blackholed = Time.getValueByDate(date, blackholedCounts);

        activeUserCount += newPromo - blackholed;

        return {
          at: dates[index + 1],
          value: activeUserCount,
        };
      })
      .filter((record) => record.at !== undefined);
  }

  async currWeekAverageEvalCount(): Promise<[number, number]> {
    return [132, 1000];
  }

  //todo: description: 비활성화 유저도 직전 상태로 포함
  async memberPercentage(): Promise<[number, number]> {
    return [240, 2038];
  }

  //todo: description: 비활성화 유저도 직전 상태로 포함
  async blackholedPercentage(): Promise<[number, number]> {
    return [1038, 2038];
  }

  async tigCountPerCoalitions(): Promise<ValuePerCoalition[]> {
    return [
      {
        coalition: {
          id: 85,
          name: 'Gun',
          slug: 'gun',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/85/gun-svg-svg.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/85/gun_cover.jpg',
          color: '#ffc221',
          score: 73891,
          userId: 107096,
        },
        value: 5,
      },
      {
        coalition: {
          id: 86,
          name: 'Gon',
          slug: 'gon',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/86/gon-svg-svg.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/86/gon_cover.jpg',
          color: '#559f7a',
          score: 71588,
          userId: 99953,
        },
        value: 10,
      },
      {
        coalition: {
          id: 87,
          name: 'Gam',
          slug: 'gam',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/87/gam-svg-svg__3_.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/87/gam_cover.jpg',
          color: '#4c83a4',
          score: 56873,
          userId: 103943,
        },
        value: 15,
      },
      {
        coalition: {
          id: 88,
          name: 'Lee',
          slug: 'lee',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/88/lee-svg-svg_1_.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/88/lee_cover.jpg',
          color: '#bb4140',
          score: 58545,
          userId: 99733,
        },
        value: 20,
      },
    ];
  }
}
