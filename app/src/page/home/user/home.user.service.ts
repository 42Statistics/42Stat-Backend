import { Injectable } from '@nestjs/common';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { CursusUserDocument } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import type { Rate } from 'src/common/models/common.rate.model';
import type { UserRanking } from 'src/common/models/common.user.model';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type { IntPerCircle, UserCountPerLevel } from './models/home.user.model';
import {
  aliveUserFilter,
  blackholedUserFilter,
} from 'src/api/cursusUser/db/cursusUser.database.query';

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

    const newPromoCounts = await this.cursusUserService.userCountPerMonth(
      'beginAt',
      dateRange,
    );

    const blackholedCounts = await this.cursusUserService.userCountPerMonth(
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

  async userCountPerLevels(): Promise<UserCountPerLevel[]> {
    return await this.cursusUserService.userCountPerLevels();
  }

  async memberRate(): Promise<Rate> {
    const total = await this.cursusUserService.userCount();
    const value = await this.cursusUserService.userCount({ grade: 'Member' });

    return {
      total,
      fields: [
        {
          key: 'member',
          value,
        },
        {
          key: 'others',
          value: total - value,
        },
      ],
    };
  }

  async blackholedRate(): Promise<Rate> {
    const total = await this.cursusUserService.userCount();
    const value = await this.cursusUserService.userCount(blackholedUserFilter);

    return {
      total,
      fields: [
        {
          key: 'blackholed',
          value,
        },
        {
          key: 'alive',
          value: total - value,
        },
      ],
    };
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

    const blackholedCount = await this.cursusUserService.userCountPerMonth(
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

  async blackholedCountPerCircle(): Promise<IntPerCircle[]> {
    return await this.cursusUserService.userCountPerCircle(
      blackholedUserFilter,
    );
  }

  async walletRanks(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.ranking(
      { sort: { 'user.wallet': -1 }, limit },
      (doc: CursusUserDocument) => doc.user.wallet,
    );
  }

  async correctionPointRanking(limit: number): Promise<UserRanking[]> {
    return await this.cursusUserService.ranking(
      {
        filter: aliveUserFilter,
        sort: { 'user.correctionPoint': -1 },
        limit,
      },
      (doc: CursusUserDocument) => doc.user.correctionPoint,
    );
  }

  async averageDuerationPerCircle(): Promise<IntPerCircle[]> {
    return await this.questsUserService.averageDuartionPerCircle();
  }
}
