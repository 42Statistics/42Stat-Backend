import { Injectable } from '@nestjs/common';
import type {
  RankingSupportedDateTemplate,
  RankCache,
} from 'src/cache/cache.util.ranking.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../models/leaderboard.model';

/**
 *
 * todo: 현재 랭킹 정보가 dateTemplate 과 기반하는 api 에 따라 0점 이하를 가릴지 알 수 없기 때문에,
 * cache 에서 그것을 정하고, cache 의 존재를 보장하는 방식으로 해결했습니다.
 */

// 나중에 랭킹 기준 세분화 시, 아래와 같은 generic 을 사용하는 것도 방법일 듯 합니다.
// RankType extends UserRank = UserRank

export type RankingByDateTemplateArgs<
  SupportDateTemplate extends DateTemplate = RankingSupportedDateTemplate,
> = {
  userId: number;
  paginationIndexArgs: PaginationIndexArgs;
  dateTemplate: SupportDateTemplate;
};

export type LeaderboardElementConvertorArgs<
  SupportDateTemplate extends DateTemplate = RankingSupportedDateTemplate,
> = {
  rank: RankCache | undefined;
  ranking: RankCache[];
} & Pick<
  RankingByDateTemplateArgs<SupportDateTemplate>,
  'paginationIndexArgs' | 'dateTemplate'
>;

@Injectable()
export class LeaderboardUtilService {
  constructor(
    private readonly paginationIndexService: PaginationIndexService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  async toLeaderboardElementDateRanged<
    SupportDateTemplate extends DateTemplate = RankingSupportedDateTemplate,
  >({
    rank,
    ranking,
    dateTemplate,
    paginationIndexArgs,
  }: LeaderboardElementConvertorArgs<SupportDateTemplate>): Promise<LeaderboardElementDateRanged> {
    const paginatedRanking = this.paginationIndexService.toPaginated(
      ranking,
      paginationIndexArgs,
    );

    const leaderboardElement: LeaderboardElement = {
      me: rank,
      totalRanking: paginatedRanking,
    };

    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return this.dateRangeService.toDateRanged(leaderboardElement, dateRange);
  }
}
