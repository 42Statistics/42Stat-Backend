import { Injectable } from '@nestjs/common';
import type {
  RankCache,
  RankingSupportedDateTemplate,
} from 'src/cache/cache.util.ranking.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import type {
  LeaderboardElement,
  LeaderboardElementDateRanged,
} from '../common/models/leaderboard.model';
import type { RankingByDateTemplateArgs } from '../common/types/leaderboard.rankingByDateTemplateArgs';

/**
 *
 * todo: 현재 랭킹 정보가 dateTemplate 과 기반하는 api 에 따라 0점 이하를 가릴지 알 수 없기 때문에,
 * cache 에서 그것을 정하고, cache 의 존재를 보장하는 방식으로 해결했습니다.
 */

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
