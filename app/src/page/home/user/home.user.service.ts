import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
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
import type { cursus_user } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { promo } from 'src/api/promo/db/promo.database.schema';
import { QuestsUserService } from 'src/api/questsUser/questsUser.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import type { Rate } from 'src/common/models/common.rate.model';
import type { UserRank } from 'src/common/models/common.user.model';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { IntPerCircle, UserCountPerLevel } from './models/home.user.model';

@Injectable()
export class HomeUserService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly questsUserService: QuestsUserService,
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
  ) {}

  // todo: 나중에 별도 service 로 분리해야 합니다.
  async monthlyAliveUserCountRecords({
    start,
    end,
  }: DateRange): Promise<IntRecord[]> {
    const totalUserIOs = await this.cursusUserService
      .aggregate<{ date: Date; count: number }>()
      .match(
        blackholedUserFilterByDateRange({
          start: new Date(0),
          end,
        }),
      )
      .group({
        _id: {
          $dateFromParts: {
            year: {
              $year: {
                date: '$blackholedAt',
                timezone: this.runtimeConfig.TIMEZONE,
              },
            },
            month: {
              $month: {
                date: '$blackholedAt',
                timezone: this.runtimeConfig.TIMEZONE,
              },
            },
            timezone: this.runtimeConfig.TIMEZONE,
          },
        },
        count: { $sum: -1 },
      })
      .project({
        _id: 0,
        date: '$_id',
        count: 1,
      })
      .unionWith({
        // todo: collection 분리
        coll: 'transfer_ins',
        pipeline: [
          {
            $match: {
              date: {
                $gte: start,
                $lt: end,
              },
            },
          },
          {
            $group: {
              _id: {
                $dateFromParts: {
                  year: {
                    $year: {
                      date: '$date',
                      timezone: this.runtimeConfig.TIMEZONE,
                    },
                  },
                  month: {
                    $month: {
                      date: '$date',
                      timezone: this.runtimeConfig.TIMEZONE,
                    },
                  },
                  timezone: this.runtimeConfig.TIMEZONE,
                },
              },
              count: { $count: {} },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              count: 1,
            },
          },
        ],
      })
      .unionWith({
        coll: `${promo.name}s`,
        pipeline: [
          {
            $match: {
              beginAt: {
                $lt: end,
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: {
                $dateFromParts: {
                  year: {
                    $year: {
                      date: '$beginAt',
                      timezone: this.runtimeConfig.TIMEZONE,
                    },
                  },
                  month: {
                    $month: {
                      date: '$beginAt',
                      timezone: this.runtimeConfig.TIMEZONE,
                    },
                  },
                  timezone: this.runtimeConfig.TIMEZONE,
                },
              },
              count: '$userCount',
            },
          },
        ],
      })
      .group({
        _id: '$date',
        count: { $sum: '$count' },
      })
      .sort({ _id: 1 })
      .project({
        _id: 0,
        date: '$_id',
        count: 1,
      });

    let prevUserCount = totalUserIOs
      .filter((userIO) => userIO.date.getTime() < start.getTime())
      .reduce((acc, { count }) => acc + count, 0);

    const recordList = new Array<IntRecord>();
    for (
      let curr = start;
      curr.getTime() < end.getTime();
      curr = new DateWrapper(curr).moveMonth(1).toDate()
    ) {
      const currRecord = totalUserIOs.find(
        ({ date }) => date.getTime() === curr.getTime(),
      );

      recordList.push({
        at: curr,
        value: prevUserCount + (currRecord?.count ?? 0),
      });

      prevUserCount += currRecord?.count ?? 0;
    }

    return recordList;
  }

  @CacheOnReturn()
  async aliveUserCountRecords(): Promise<IntRecord[]> {
    const now = new DateWrapper();
    const lastYear = now.startOfMonth().moveMonth(1).moveYear(-1);

    const dateRange: DateRange = {
      start: lastYear.toDate(),
      end: now.toDate(),
    };

    return await this.cursusUserService.aliveUserCountRecords(dateRange);
  }

  @CacheOnReturn()
  async userCountPerLevels(): Promise<UserCountPerLevel[]> {
    return await this.cursusUserService.userCountPerLevels();
  }

  @CacheOnReturn()
  async userRate(): Promise<Rate> {
    return await this.cursusUserService.userRate();
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

  async blackholedCountRecords({
    start,
    end,
  }: DateRange): Promise<IntRecord[]> {
    return await this.cursusUserService
      .aggregate<IntRecord>()
      .match(blackholedUserFilterByDateRange({ start, end }))
      .group({
        _id: {
          $dateFromParts: {
            year: {
              $year: {
                date: '$blackholedAt',
                timezone: this.runtimeConfig.TIMEZONE,
              },
            },
            month: {
              $month: {
                date: '$blackholedAt',
                timezone: this.runtimeConfig.TIMEZONE,
              },
            },
            timezone: this.runtimeConfig.TIMEZONE,
          },
        },
        count: { $count: {} },
      })
      .sort({ _id: 1 })
      .project({
        _id: 0,
        at: '$_id',
        value: '$count',
      });
  }

  @CacheOnReturn()
  async blackholedCountPerCircle(): Promise<IntPerCircle[]> {
    return await this.cursusUserService.userCountPerCircle(
      blackholedUserFilterByDateRange(),
    );
  }

  async walletRanking(limit: number): Promise<UserRank[]> {
    const cachedRanking = await this.cursusUserCacheService.getUserRanking({
      keyBase: USER_WALLET_RANKING,
    });

    const ranking =
      cachedRanking ??
      (await this.cursusUserService.ranking(
        { filter: aliveUserFilter, sort: { 'user.wallet': -1 } },
        (cursusUser: cursus_user) => cursusUser.user.wallet,
      ));

    return ranking.slice(0, limit);
  }

  async correctionPointRanking(limit: number): Promise<UserRank[]> {
    const cachedRanking = await this.cursusUserCacheService.getUserRanking({
      keyBase: USER_CORRECTION_POINT_RANKING,
    });

    const ranking =
      cachedRanking ??
      (await this.cursusUserService.ranking(
        {
          filter: aliveUserFilter,
          sort: { 'user.correctionPoint': -1 },
        },
        (cursusUser: cursus_user) => cursusUser.user.correctionPoint,
      ));

    return ranking.slice(0, limit);
  }

  @CacheOnReturn()
  async averageDuerationPerCircle(): Promise<IntPerCircle[]> {
    return await this.questsUserService.averageDuartionPerCircle();
  }
}
