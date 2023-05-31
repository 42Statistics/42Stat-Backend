import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';
import { Total } from './models/total.model';
import { TotalService } from './total.service';

@Resolver((_of: unknown) => Total)
export class TotalResolver {
  constructor(
    private totalService: TotalService, //@Inject('REDIS_CRON_CLIENT') //private redisClient: RedisClientType,
  ) {}

  @Query((_returns) => Total)
  async getTotalPage() {
    return {};
  }

  @ResolveField('monthlyScoreRanks', (_returns) => UserRankingDateRanged)
  async monthlyScoreRanks(): Promise<UserRankingDateRanged> {
    return await this.totalService.monthlyScoreRanks();
  }
}
