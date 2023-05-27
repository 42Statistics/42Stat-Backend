import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
import {
  CoalitionScore,
  CoalitionScoreRecords,
} from 'src/api/score/models/score.coalition.model';
import { Time } from 'src/util';
import {
  ProjectInfo,
  Total,
  UserCountPerLevels,
  ValuePerCircle,
  ValueRecord,
} from './models/total.model';
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

  @ResolveField('totalScores', (_returns) => [CoalitionScore])
  async totalScores(): Promise<CoalitionScore[]> {
    //const cached = await this.redisClient.zRange('totalScores', 0, -1, {
    //  REV: true,
    //});

    //if (cached.length) return cached.map((curr) => JSON.parse(curr));

    return await this.totalService.totalScores();
  }

  @ResolveField('scoreRecords', (_returns) => [CoalitionScoreRecords])
  async scoreRecords(): Promise<CoalitionScoreRecords[]> {
    //const cached = await this.redisClient.sMembers('scoreRecords');

    //const cachedStrings = await this.redisClient.sMembers('scoreRecords');
    //const cached = cachedStrings.map(JSON.parse);

    //if (cached.length) {
    //  console.log(cached);
    //console.log(cached.map((record) => JSON.parse(record)));
    //return cached.map((record) => JSON.parse(record));
    //}

    return await this.totalService.scoreRecords();
  }

  @ResolveField('monthlyScoreRanks', (_returns) => UserRankingDateRanged)
  async monthlyScoreRanks(): Promise<UserRankingDateRanged> {
    return await this.totalService.monthlyScoreRanks();
  }

  @ResolveField('totalEvalCount', (_returns) => Int)
  async totalEvalCount(): Promise<number> {
    return await this.totalService.totalEvalCount();
  }

  @ResolveField('averageFeedbackLength', (_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.totalService.averageFeedbackLength();
  }

  @ResolveField('averageCommentLength', (_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.totalService.averageCommentLength();
  }

  @ResolveField('userCountPerLevels', (_returns) => [UserCountPerLevels])
  async userCountPerLevel(): Promise<UserCountPerLevels[]> {
    return await this.totalService.userCountPerLevels();
  }

  @ResolveField('walletRanks', (_returns) => [UserRanking])
  async walletRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.totalService.walletRanks(limit);
  }

  @ResolveField('correctionPointRanks', (_returns) => [UserRanking])
  async correctionPointRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.totalService.correctionPointRanks(limit);
  }

  @ResolveField('averageCircleDurations', (_returns) => [ValuePerCircle])
  async averageCircleDurations(): Promise<ValuePerCircle[]> {
    return await this.totalService.averageCircleDurations();
  }

  @ResolveField('blackholedCountPerCircles', (_returns) => [ValuePerCircle])
  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.totalService.blackholedCountPerCircles();
  }

  @ResolveField('activeUserCountRecords', (_returns) => [ValueRecord])
  async activeUserCountRecords(): Promise<ValueRecord[]> {
    const curr = Time.curr();
    const startOfNextMonth = Time.startOfMonth(Time.moveMonth(curr, 1));
    const start = Time.moveYear(startOfNextMonth, -1);

    return await this.totalService.activeUserCountRecords(start, curr);
  }

  //@ResolveField('averageCircleDurationsByPromo', (_returns) => [
  //  ValuePerCircleByPromo,
  //])
  //async averageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  return await this.totalService.averageCircleDurationsByPromo();
  //}
}
