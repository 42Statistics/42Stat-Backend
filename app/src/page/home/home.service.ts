import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { SEOUL_COALITION_ID } from 'src/api/coalition/coalition.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { ScoreService } from 'src/api/score/score.service';
import type {
  NumberDateRanged,
  NumericRateDateRanged,
} from 'src/common/models/common.dateRanaged';
import type { NumericRate } from 'src/common/models/common.rate.model';
import type { UserRanking } from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { Time } from 'src/util';
import type {
  ScoreRecordPerCoalition,
  UserCountPerLevels,
  ValuePerCircle,
  ValuePerCoalition,
  ValueRecord,
} from './models/home.model';

@Injectable()
export class HomeService {
  constructor(
    private cursusUserService: CursusUserService,
    private scaleTeamService: ScaleTeamService,
    private scoreService: ScoreService,
    private questsUserService: QuestsUserService,
    private dateRangeService: DateRangeService,
  ) {}

  async activeUserCountRecords(): Promise<ValueRecord[]> {
    const now = Time.now();
    const nextMonth = Time.moveMonth(Time.startOfMonth(now), 1);
    const lastYear = Time.moveYear(nextMonth, -1);

    const dateRange: DateRange = {
      start: lastYear,
      end: Time.now(),
    };

    const newPromoCounts = await this.cursusUserService.countPerMonth(
      'beginAt',
      dateRange,
    );

    const blackholedCounts = await this.cursusUserService.countPerMonth(
      'blackholedAt',
      dateRange,
    );

    const dates = Time.partitionByMonth(dateRange);

    return dates.reduce(
      ([valueRecords, activeUserCount], date, index) => {
        const newPromo = Time.getValueByDate(date, newPromoCounts);
        const blackholed = Time.getValueByDate(date, blackholedCounts);

        const currActiveUserCount = activeUserCount + newPromo - blackholed;

        const at = dates.at(index + 1);

        if (at) {
          valueRecords.push({ at, value: currActiveUserCount });
        }

        return [valueRecords, currActiveUserCount] as const;
      },
      [[], 0] as readonly [ValueRecord[], number],
    )[0];
  }

  async userCountPerLevels(): Promise<UserCountPerLevels[]> {
    return await this.cursusUserService.userCountPerLevels();
  }

  //todo: description: 비활성화 유저도 직전 상태로 포함
  async memberRate(): Promise<NumericRate> {
    return { total: 2038, value: 240 };
  }

  //todo: description: 비활성화 유저도 직전 상태로 포함
  async blackholedRate(): Promise<NumericRate> {
    return { total: 2038, value: 1038 };
  }

  async blackholedCountByDateRange({
    start,
    end,
  }: DateRange): Promise<NumberDateRanged> {
    const now = Time.now();

    const dateRange: DateRange = {
      start,
      end: now < end ? now : end,
    };

    const blackholedCount = await this.cursusUserService.countPerMonth(
      'blackholedAt',
      dateRange,
    );

    return this.dateRangeService.toDateRanged(
      Time.getValueByDate(dateRange.start, blackholedCount),
      dateRange,
    );
  }

  async blackholedCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<NumberDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.blackholedCountByDateRange(dateRange);
  }

  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.cursusUserService.blackholedCountPerCircles();
  }

  async evalCount(filter?: FilterQuery<scale_team>): Promise<number> {
    return await this.scaleTeamService.evalCount(filter);
  }

  async evalCountByDateRange(dateRange: DateRange): Promise<NumberDateRanged> {
    const evalFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      filledAt: { $ne: null },
    };

    const evalCount = await this.evalCount(evalFilter);

    return this.dateRangeService.toDateRanged(evalCount, dateRange);
  }

  async evalCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<NumberDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.evalCountByDateRange(dateRange);
  }

  async averageEvalCountByDateRange(
    dateRange: DateRange,
  ): Promise<NumericRateDateRanged> {
    return this.dateRangeService.toDateRanged(
      { total: 1000, value: 132 },
      dateRange,
    );
  }

  async averageEvalCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<NumericRateDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.averageEvalCountByDateRange(dateRange);
  }

  async averageFeedbackLength(): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('feedback');
  }

  async averageCommentLength(): Promise<number> {
    return await this.scaleTeamService.averageReviewLength('comment');
  }

  async totalScoresPerCoalition(): Promise<ValuePerCoalition[]> {
    return await this.scoreService.scoresPerCoalition();
  }

  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    const currMonth = Time.startOfMonth(Time.now());
    const lastYear = Time.moveYear(currMonth, -1);

    const dateRange: DateRange = {
      start: lastYear,
      end: currMonth,
    };

    return await this.scoreService.scoreRecordsPerCoalition({
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      coalitionsUserId: { $ne: null },
      coalitionId: { $in: SEOUL_COALITION_ID },
    });
  }

  async walletRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.rank('user.wallet', limit);
  }

  async correctionPointRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.rank('user.correctionPoint', limit);
  }

  async averageCircleDurations(): Promise<ValuePerCircle[]> {
    return await this.questsUserService.averageCircleDurations();
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

  //async averageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  return await this.questsUserService.getAverageCircleDurationsByPromo();
  //}
}
