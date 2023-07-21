import { Injectable } from '@nestjs/common';
import {
  CursusUserCacheService,
  USER_CORRECTION_POINT_RANKING,
  USER_WALLET_RANKING,
} from 'src/api/cursusUser/cursusUser.cache.service';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import {
  aliveUserFilter,
  blackholedUserFilterByDateRange,
} from 'src/api/cursusUser/db/cursusUser.database.query';
import type { CursusUserDocument } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import type { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import type { Rate } from 'src/common/models/common.rate.model';
import type { UserRank } from 'src/common/models/common.user.model';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { StatDate } from 'src/statDate/StatDate';
import type { IntPerCircle, UserCountPerLevel } from './models/home.user.model';

@Injectable()
export class HomeUserService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly questsUserService: QuestsUserService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  @CacheOnReturn()
  async aliveUserCountRecords(): Promise<IntRecord[]> {
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
      ([valueRecords, aliveUserCount], date, index) => {
        const newPromo = StatDate.getValueByDate(date, newPromoCounts);
        const blackholed = StatDate.getValueByDate(date, blackholedCounts);

        const currAliveUserCount = aliveUserCount + newPromo - blackholed;

        const at = dates.at(index + 1);

        if (at) {
          valueRecords.push({ at, value: currAliveUserCount });
        }

        return [valueRecords, currAliveUserCount] as const;
      },
      [[], 0] as readonly [IntRecord[], number],
    )[0];
  }

  @CacheOnReturn()
  async userCountPerLevels(): Promise<UserCountPerLevel[]> {
    return await this.cursusUserService.userCountPerLevels();
  }

  @CacheOnReturn()
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

  @CacheOnReturn()
  async blackholedRate(): Promise<Rate> {
    const total = await this.cursusUserService.userCount();
    const value = await this.cursusUserService.userCount(
      blackholedUserFilterByDateRange(),
    );

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

  @CacheOnReturn()
  async blackholedCountByDateRange({
    start,
    end,
  }: DateRange): Promise<IntDateRanged> {
    const now = new StatDate();

    const dateRange: DateRange = {
      start,
      end: now < end ? now : end,
    };

    const blackholedCount = await this.cursusUserService.userCount(
      blackholedUserFilterByDateRange(dateRange),
    );

    // todo: 현재 시간 / 갱신 시간
    return this.dateRangeService.toDateRanged(blackholedCount, { start, end });
  }

  @CacheOnReturn()
  async blackholedCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.blackholedCountByDateRange(dateRange);
  }

  @CacheOnReturn()
  async blackholedCountPerCircle(): Promise<IntPerCircle[]> {
    return await this.cursusUserService.userCountPerCircle(
      blackholedUserFilterByDateRange(),
    );
  }

  async walletRanking(limit: number): Promise<UserRank[]> {
    const cachedRanking = await this.cursusUserCacheService.getUserRanking(
      USER_WALLET_RANKING,
    );

    const walletRanking = cachedRanking
      ? cachedRanking.slice(0, limit)
      : await this.cursusUserService.ranking(
          { sort: { 'user.wallet': -1 }, limit },
          (doc: CursusUserDocument) => doc.user.wallet,
        );

    return walletRanking;
  }

  async correctionPointRanking(limit: number): Promise<UserRank[]> {
    const cachedRanking = await this.cursusUserCacheService.getUserRanking(
      USER_CORRECTION_POINT_RANKING,
    );

    return cachedRanking
      ? cachedRanking.slice(0, limit)
      : await this.cursusUserService.ranking(
          {
            filter: aliveUserFilter,
            sort: { 'user.correctionPoint': -1 },
            limit,
          },
          (doc: CursusUserDocument) => doc.user.correctionPoint,
        );
  }

  @CacheOnReturn()
  async averageDuerationPerCircle(): Promise<IntPerCircle[]> {
    return await this.questsUserService.averageDuartionPerCircle();
  }
}
