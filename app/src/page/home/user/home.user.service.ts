import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import type { IntRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type {
  IntPerCircle,
  UserCountPerLevels,
} from './models/home.user.model';

@Injectable()
export class HomeUserService {
  constructor(
    private cursusUserService: CursusUserService,
    private questsUserService: QuestsUserService,
    private dateRangeService: DateRangeService,
  ) {}

  async activeUserCountRecords(): Promise<IntRecord[]> {
    const now = new StatDate();
    const lastYear = now.startOfMonth().moveMonth(1).moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear,
      end: now,
    };

    const newPromoCounts = await this.cursusUserService.countPerMonth(
      'beginAt',
      dateRange,
    );

    const blackholedCounts = await this.cursusUserService.countPerMonth(
      'blackholedAt',
      dateRange,
    );

    const dates = StatDate.partitionByMonth(dateRange);

    return dates.reduce(
      ([valueRecords, activeUserCount], date, index) => {
        const newPromo = StatDate.getValueByDate(date, newPromoCounts);
        const blackholed = StatDate.getValueByDate(date, blackholedCounts);

        const currActiveUserCount = activeUserCount + newPromo - blackholed;

        const at = dates.at(index + 1);

        if (at) {
          valueRecords.push({ at, value: currActiveUserCount });
        }

        return [valueRecords, currActiveUserCount] as const;
      },
      [[], 0] as readonly [IntRecord[], number],
    )[0];
  }

  async userCountPerLevels(): Promise<UserCountPerLevels[]> {
    return await this.cursusUserService.userCountPerLevels();
  }

  //todo: description: 비활성화 유저도 직전 상태로 포함
  async memberRate(): Promise<IntRate> {
    return { total: 2038, value: 240 };
  }

  //todo: description: 비활성화 유저도 직전 상태로 포함
  async blackholedRate(): Promise<IntRate> {
    return { total: 2038, value: 1038 };
  }

  async blackholedCountByDateRange({
    start,
    end,
  }: DateRange): Promise<IntDateRanged> {
    const now = new StatDate();

    const dateRange: DateRange = {
      start,
      end: now < end ? now : end,
    };

    const blackholedCount = await this.cursusUserService.countPerMonth(
      'blackholedAt',
      dateRange,
    );

    return this.dateRangeService.toDateRanged(
      StatDate.getValueByDate(dateRange.start, blackholedCount),
      dateRange,
    );
  }

  async blackholedCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.blackholedCountByDateRange(dateRange);
  }

  async blackholedCountPerCircles(): Promise<IntPerCircle[]> {
    return await this.cursusUserService.blackholedCountPerCircles();
  }

  async walletRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.rank('user.wallet', limit);
  }

  async correctionPointRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.rank('user.correctionPoint', limit);
  }

  async averageCircleDurations(): Promise<IntPerCircle[]> {
    return await this.questsUserService.averageCircleDurations();
  }
}
