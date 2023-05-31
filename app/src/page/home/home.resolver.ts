import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  CoalitionPerValue,
  CoalitionScoreRecords,
} from 'src/api/score/models/score.coalition.model';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { UserRanking } from 'src/common/models/common.user.model';
import { Time } from 'src/util';
import {
  UserCountPerLevels,
  ValuePerCircle,
  ValueRecord,
} from '../home/models/home.model';
import { HomeService } from './home.service';
import { Home } from './models/home.model';

@Resolver((_of: unknown) => Home)
export class HomeResolver {
  constructor(private homeService: HomeService) {}

  @Query((_returns) => Home)
  async getHomePage() {
    return {
      currRegisteredCountRank: [
        {
          projectPreview: {
            id: '1',
            name: 'ft_ping',
            url: 'https://projects.intra.42.fr/projects/1',
          },
          value: 320,
        },
        {
          projectPreview: {
            id: '2',
            name: 'libft',
            url: 'https://projects.intra.42.fr/projects/1',
          },
          value: 280,
        },
        {
          projectPreview: {
            id: '3',
            name: 'get_next_line',
            url: 'https://projects.intra.42.fr/projects/1',
          },
          value: 220,
        },
      ],
      lastExamResult: {
        data: [
          { rank: 2, passCount: 9, totalCount: 20 },
          { rank: 3, passCount: 3, totalCount: 20 },
          { rank: 4, passCount: 4, totalCount: 12 },
          { rank: 5, passCount: 8, totalCount: 18 },
          { rank: 6, passCount: 1, totalCount: 10 },
        ],
        from: new Date(),
        to: new Date(),
      },
    };
  }

  @ResolveField('currWeekEvalCount', (_returns) => NumberDateRanged)
  async currWeekEvalCount(): Promise<NumberDateRanged> {
    return await this.homeService.currWeekEvalCount();
  }

  @ResolveField('lastWeekEvalCount', (_returns) => NumberDateRanged)
  async lastWeekEvalCount(): Promise<NumberDateRanged> {
    return await this.homeService.lastWeekEvalCount();
  }

  @ResolveField('lastMonthBlackholedCount', (_returns) => NumberDateRanged)
  async lastMonthBlackholedCount(): Promise<NumberDateRanged> {
    return await this.homeService.lastMonthBlackholedCount();
  }

  @ResolveField('currMonthBlackholedCount', (_returns) => NumberDateRanged)
  async currMonthBlackholedCount(): Promise<NumberDateRanged> {
    return await this.homeService.currMonthBlackholedCount();
  }

  @ResolveField('totalScores', (_returns) => [CoalitionPerValue])
  async totalScores(): Promise<CoalitionPerValue[]> {
    return await this.homeService.totalScores();
  }

  @ResolveField('scoreRecords', (_returns) => [CoalitionScoreRecords])
  async scoreRecords(): Promise<CoalitionScoreRecords[]> {
    return await this.homeService.scoreRecords();
  }

  @ResolveField('totalEvalCount', (_returns) => Int)
  async totalEvalCount(): Promise<number> {
    return await this.homeService.totalEvalCount();
  }

  @ResolveField('averageFeedbackLength', (_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.homeService.averageFeedbackLength();
  }

  @ResolveField('averageCommentLength', (_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.homeService.averageCommentLength();
  }

  @ResolveField('userCountPerLevels', (_returns) => [UserCountPerLevels])
  async userCountPerLevel(): Promise<UserCountPerLevels[]> {
    return await this.homeService.userCountPerLevels();
  }
  @ResolveField('walletRanks', (_returns) => [UserRanking])
  async walletRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeService.walletRanks(limit);
  }

  @ResolveField('correctionPointRanks', (_returns) => [UserRanking])
  async correctionPointRanks(
    @Args('limit', { defaultValue: 5 }) limit: number,
  ): Promise<UserRanking[]> {
    return await this.homeService.correctionPointRanks(limit);
  }

  @ResolveField('averageCircleDurations', (_returns) => [ValuePerCircle])
  async averageCircleDurations(
    @Args('uid', { nullable: true }) uid: number,
  ): Promise<ValuePerCircle[]> {
    return await this.homeService.averageCircleDurations(uid);
  }

  //@ResolveField('averageCircleDurationsByPromo', (_returns) => [
  //  ValuePerCircleByPromo,
  //])
  //async averageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  return await this.totalService.averageCircleDurationsByPromo();
  //}

  @ResolveField('blackholedCountPerCircles', (_returns) => [ValuePerCircle])
  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.homeService.blackholedCountPerCircles();
  }

  @ResolveField('activeUserCountRecords', (_returns) => [ValueRecord])
  async activeUserCountRecords(): Promise<ValueRecord[]> {
    const curr = Time.curr();
    const startOfNextMonth = Time.startOfMonth(Time.moveMonth(curr, 1));
    const start = Time.moveYear(startOfNextMonth, -1);

    return await this.homeService.activeUserCountRecords(start, curr);
  }

  @ResolveField('currWeekAverageEvalCount', (_returns) => [Int, Int])
  async currWeekAverageEvalCount(): Promise<[number, number]> {
    return await this.homeService.currWeekAverageEvalCount();
  }

  @ResolveField('memberPercentage', (_returns) => [Int, Int])
  async memberPercentage(): Promise<[number, number]> {
    return await this.homeService.memberPercentage();
  }

  @ResolveField('blackholedPercentage', (_returns) => [Int, Int])
  async blackholedPercentage(): Promise<[number, number]> {
    return await this.homeService.blackholedPercentage();
  }

  @ResolveField('tigCountPerCoalitions', (_returns) => [CoalitionPerValue])
  async tigCountPerCoalitions(): Promise<CoalitionPerValue[]> {
    return await this.homeService.tigCountPerCoalitions();
  }
}
