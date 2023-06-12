import type { FilterQuery } from 'mongoose';
import type { UserRank } from 'src/common/models/common.user.model';
import type { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';

// todo: 적당한 파일 위치..?

export type RankingArgs<T> = {
  userId: number;
  paginationIndexArgs: PaginationIndexArgs;
  filter?: FilterQuery<T>;
  cachedRanking?: UserRank[];
};
