import type { RankingSupportedDateTemplate } from 'src/cache/cache.util.ranking.service';
import type { DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import type { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';

export type RankingByDateTemplateArgs<
  SupportDateTemplate extends DateTemplate = RankingSupportedDateTemplate,
> = {
  userId: number;
  promo?: number;
  coalitionId?: number;
  paginationIndexArgs: PaginationIndexArgs;
  dateTemplate: SupportDateTemplate;
};
