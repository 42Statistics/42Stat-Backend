import type { FilterQuery } from 'mongoose';
import type { RankCache } from 'src/cache/cache.util.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from './models/leaderboard.model';

export type RankingArgs<T> = {
  userId: number;
  paginationIndexArgs: PaginationIndexArgs;
  filter?: FilterQuery<T>;
  cachedRanking?: RankCache[];
};

export type RankingFn<T> = (
  args: RankingArgs<T>,
) => Promise<LeaderboardElement>;

export type RankingByDateRangeFn<T> = (
  dateRange: DateRange,
  args: Omit<RankingArgs<T>, 'filter'>,
) => Promise<LeaderboardElementDateRanged>;

export type RankingByDateTemplateFn<T, SupportDateTemplate = DateTemplate> = (
  dateTemplate: SupportDateTemplate,
  args: Pick<RankingArgs<T>, 'userId' | 'paginationIndexArgs'>,
) => Promise<LeaderboardElementDateRanged>;
