import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import type {
  CacheSupportedDateTemplate,
  RankCache,
} from 'src/cache/cache.util.service';
import { findUserRank } from 'src/common/findUserRank';
import type { UserRank } from 'src/common/models/common.user.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';

// 나중에 랭킹 기준 세분화 시, 아래와 같은 generic 을 사용하는 것도 방법일 듯 합니다.
// RankType extends UserRank = UserRank

export type QueryRankingFn<T> = (
  filter?: FilterQuery<T>,
) => Promise<UserRank[]>;

export type RankingArgs<T> = {
  userId: number;
  paginationIndexArgs: PaginationIndexArgs;
  filter?: FilterQuery<T>;
  cachedRanking?: RankCache[];
};

export type RankingByDateTemplateFn<
  T,
  SupportDateTemplate = CacheSupportedDateTemplate,
> = (
  dateTemplate: SupportDateTemplate,
  rankingArgs: Pick<RankingArgs<T>, 'userId' | 'paginationIndexArgs'>,
) => Promise<LeaderboardElementDateRanged>;

@Injectable()
export class LeaderboardUtilService {
  constructor(
    private paginationIndexService: PaginationIndexService,
    private dateRangeService: DateRangeService,
  ) {}

  // eslint-disable-next-line
  async rankingImpl<T>(
    queryRankingFn: QueryRankingFn<T>,
    { userId, paginationIndexArgs, filter, cachedRanking }: RankingArgs<T>,
  ) {
    const ranking = cachedRanking ?? (await queryRankingFn(filter));
    const user = findUserRank(ranking, userId);

    return this.toLeaderboardElement(user, ranking, paginationIndexArgs);
  }

  async rankingByDateRangeImpl<T>(
    queryRankingFn: QueryRankingFn<T>,
    dateRange: DateRange,
    rankingArgs: Omit<RankingArgs<T>, 'filter'>,
  ): Promise<LeaderboardElementDateRanged> {
    const ranking = await this.rankingImpl(queryRankingFn, rankingArgs);
    return this.dateRangeService.toDateRanged(ranking, dateRange);
  }

  async rankingByDateTemplateImpl<
    T,
    SupportDateTemplate extends DateTemplate = CacheSupportedDateTemplate,
  >(
    dateTemplate: SupportDateTemplate,
    rankingArgs: Pick<RankingArgs<T>, 'userId' | 'paginationIndexArgs'>,
    getCachedFn: (
      dateTemplate: SupportDateTemplate,
    ) => Promise<RankCache[] | undefined>,
    queryRankingFn: QueryRankingFn<T>,
  ): Promise<LeaderboardElementDateRanged> {
    const cachedRanking = await getCachedFn(dateTemplate);
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    const rankingArgsWithCache: Omit<RankingArgs<T>, 'filter'> = {
      ...rankingArgs,
      cachedRanking,
    };

    if (dateTemplate === DateTemplate.TOTAL) {
      const ranking = await this.rankingImpl(
        queryRankingFn,
        rankingArgsWithCache,
      );

      return this.dateRangeService.toDateRanged(ranking, dateRange);
    }

    return await this.rankingByDateRangeImpl(
      queryRankingFn,
      dateRange,
      rankingArgsWithCache,
    );
  }

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
