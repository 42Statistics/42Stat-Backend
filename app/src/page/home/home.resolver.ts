import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  NumberDateRanged,
  NumericRateDateRanged,
} from 'src/common/models/common.dateRanaged';
import { NumericRate } from 'src/common/models/common.rate.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import {
  ScoreRecordPerCoalition,
  UserCountPerLevels,
  ValuePerCircle,
  ValuePerCoalition,
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

  @ResolveField('activeUserCountRecords', (_returns) => [ValueRecord])
  async activeUserCountRecords(): Promise<ValueRecord[]> {
    return await this.homeService.activeUserCountRecords();
  }

  @ResolveField('userCountPerLevels', (_returns) => [UserCountPerLevels])
  async userCountPerLevel(): Promise<UserCountPerLevels[]> {
    return await this.homeService.userCountPerLevels();
  }

  @ResolveField('memberRate', (_returns) => NumericRate)
  async memberRate(): Promise<NumericRate> {
    return await this.homeService.memberRate();
  }

  @ResolveField('blackholedRate', (_returns) => NumericRate)
  async blackholedRate(): Promise<NumericRate> {
    return await this.homeService.blackholedRate();
  }

  @ResolveField('blackholedCountByDateTemplate', (_returns) => NumberDateRanged)
  async blackholedCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ) {
    return await this.homeService.blackholedCountByDateTemplate(dateTemplate);
  }

  @ResolveField('blackholedCountPerCircles', (_returns) => [ValuePerCircle])
  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    return await this.homeService.blackholedCountPerCircles();
  }

  @ResolveField('totalEvalCount', (_returns) => NumberDateRanged)
  async evalCount(): Promise<NumberDateRanged> {
    return await this.evalCount();
  }

  @ResolveField('evalCountByDateTemplate', (_returns) => NumberDateRanged)
  async evalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<NumberDateRanged> {
    return await this.homeService.evalCountByDateTemplate(dateTemplate);
  }

  @ResolveField(
    'averageEvalCountByDateTemplate',
    (_returns) => NumericRateDateRanged,
  )
  async averageEvalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<NumericRateDateRanged> {
    return await this.homeService.averageEvalCountByDateTemplate(dateTemplate);
  }

  @ResolveField('averageFeedbackLength', (_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.homeService.averageFeedbackLength();
  }

  @ResolveField('averageCommentLength', (_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.homeService.averageCommentLength();
  }

  @ResolveField('totalScoresPerCoalition', (_returns) => [ValuePerCoalition])
  async totalScores(): Promise<ValuePerCoalition[]> {
    return await this.homeService.totalScoresPerCoalition();
  }

  @ResolveField('scoreRecordsPerCoalition', (_returns) => [
    ScoreRecordPerCoalition,
  ])
  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    return await this.homeService.scoreRecordsPerCoalition();
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
  async averageCircleDurations(): Promise<ValuePerCircle[]> {
    return await this.homeService.averageCircleDurations();
  }

  @ResolveField('tigCountPerCoalitions', (_returns) => [ValuePerCoalition])
  async tigCountPerCoalitions(): Promise<ValuePerCoalition[]> {
    return await this.homeService.tigCountPerCoalitions();
  }

  //@ResolveField('averageCircleDurationsByPromo', (_returns) => [
  //  ValuePerCircleByPromo,
  //])
  //async averageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  return await this.totalService.averageCircleDurationsByPromo();
  //}
}
