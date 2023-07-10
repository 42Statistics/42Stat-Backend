import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type { RankCache } from 'src/cache/cache.util.service';
import { findUserRank } from 'src/common/findUserRank';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import {
  RankingArgs,
  RankingByDateRangeFn,
  RankingFn,
} from '../leaderboard.type';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';

@Injectable()
export class LeaderboardUtilService {
  constructor(
    private paginationIndexService: PaginationIndexService,
    private dateRangeService: DateRangeService,
  ) {}

  // eslint-disable-next-line
  async rankingImpl<T>(
    queryRankingFn: (filter?: FilterQuery<T>) => Promise<UserRank[]>,
    { userId, paginationIndexArgs, filter, cachedRanking }: RankingArgs<T>,
  ): ReturnType<RankingFn<T>> {
    const ranking = cachedRanking ?? (await queryRankingFn(filter));
    const user = findUserRank(ranking, userId);

    return this.toLeaderboardElement(user, ranking, paginationIndexArgs);
  }

  // todo: leaderboad refactor

  // rankingByDateRageImpl<T>(
  //   dateFilterFn: (dateRange: DateRange) => FilterQuery<T>,
  //   dateRange: DateRange,
  //   rankingArgs: Parameters<RankingByDateRangeFn<T>>[1],
  // ): (
  //   queryRankingFn: (filter?: FilterQuery<T>) => Promise<UserRank[]>,
  // ) => Promise<LeaderboardElementDateRanged> {
  //   return async (
  //     queryRankingFn: (filter?: FilterQuery<T>) => Promise<UserRank[]>,
  //   ) => {
  //     const leaderboardElement = await this.rankingImpl(queryRankingFn, {
  //       ...rankingArgs,
  //       ...dateFilterFn(dateRange),
  //     });

  //     return this.dateRangeService.toDateRanged(leaderboardElement, dateRange);
  //   };
  // }

  // rankingTotal<T>(): ReturnType<typeof this.rankingByDateRageImpl> {
  //   return () => this.rankingImpl()
  // }

  // rankingByDateTemplateImpl<T>(
  //   dateTemplate: DateTemplate,
  //   rankingArgs: Pick<RankingArgs<T>, 'userId' | 'paginationIndexArgs'>,
  //   cachedRanking?: UserRankCache[],
  // ): (
  //   dateFilterFn: (dateRange: DateRange) => FilterQuery<T>,
  // ) => ReturnType<typeof this.rankingByDateRageImpl> {
  //   const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

  //   return (dateFilterFn: (dateRange: DateRange) => FilterQuery<T>) =>
  //     this.rankingByDateRageImpl(dateFilterFn, dateRange, {
  //       ...rankingArgs,
  //       cachedRanking,
  //     });
  // }

  toLeaderboardElement(
    me: UserRank | undefined,
    totalRanking: UserRank[],
    paginationIndexArgs: PaginationIndexArgs,
  ): LeaderboardElement {
    return {
      me,
      totalRanking: this.paginationIndexService.toPaginated(
        totalRanking,
        paginationIndexArgs,
      ),
    };
  }
}
