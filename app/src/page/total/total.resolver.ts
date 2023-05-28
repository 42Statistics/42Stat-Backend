import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';
import { ProjectInfo, Total } from './models/total.model';
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

  @ResolveField('projectInfo', (_returns) => ProjectInfo)
  async getProjectInfo(
    @Args('projectName', { defaultValue: 'libft' }) projectName: string,
  ) {
    if (projectName === 'ft_printf') {
      return {
        id: '1',
        name: 'ft_printf',
        skills: ['c', 'makefile'],
        averagePassFinalmark: 115,
        averageDurationTime: 17,
        totalCloseCount: 2000,
        currRegisteredCount: 40,
        passPercentage: 30,
        totalEvalCount: 2200,
      };
    }
    return {
      id: '2',
      name: 'libft',
      skills: ['c', 'makefile'],
      averagePassFinalmark: 109,
      averageDurationTime: 17,
      totalCloseCount: 1801,
      currRegisteredCount: 80,
      passPercentage: 50,
      totalEvalCount: 3392,
    };
  }

  @ResolveField('monthlyScoreRanks', (_returns) => UserRankingDateRanged)
  async monthlyScoreRanks(): Promise<UserRankingDateRanged> {
    return await this.totalService.monthlyScoreRanks();
  }
}
