import type { FilterQuery } from 'mongoose';
import type { UserRankCache } from 'src/cache/cache.service';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';

// todo: 적당한 파일 위치..?

export type RankingArgs<T> = {
  userId: number;
  paginationIndexArgs: PaginationIndexArgs;
  filter?: FilterQuery<T>;
  cachedRanking?: UserRankCache[];
};
