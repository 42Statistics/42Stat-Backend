import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRankingDateRanged } from 'src/common/models/common.user.model';
import {
  ProjectInfo,
  ScoreRecords,
  Total,
  TotalScore,
} from './models/total.model';
import { TotalService } from './total.service';

@Resolver((_of: unknown) => Total)
export class TotalResolver {
  constructor(private totalService: TotalService) {}

  @Query((_returns) => Total)
  async getTotalPage() {
    return {
      activeUserCntRecords: [
        {
          at: new Date('2022-11-01T00:00:00.405Z'),
          value: 1000,
        },
        {
          at: new Date('2022-12-01T00:00:00.405Z'),
          value: 2250,
        },
        {
          at: new Date('2023-01-01T00:00:00.405Z'),
          value: 1500,
        },
        {
          at: new Date('2023-02-01T00:00:00.405Z'),
          value: 3000,
        },
        {
          at: new Date('2023-03-01T00:00:00.405Z'),
          value: 750,
        },
        {
          at: new Date('2023-04-01T00:00:00.405Z'),
          value: 1000,
        },
      ],
      blackholedCntPerCircles: [
        {
          circle: 0,
          value: 150,
        },
        {
          circle: 1,
          value: 50,
        },
        {
          circle: 2,
          value: 20,
        },
        {
          circle: 3,
          value: 30,
        },
        {
          circle: 4,
          value: 45,
        },
        {
          circle: 5,
          value: 5,
        },
        {
          circle: 6,
          value: 15,
        },
      ],
      correctionPointRanks: [
        {
          userPreview: {
            id: '99756',
            login: 'yuhwang',
            imgUrl:
              'https://cdn.intra.42.fr/users/229c609882b1f47557bad820b39cd65a/yuhwang.jpeg',
          },
          value: 240,
        },
        {
          userPreview: {
            id: 99947,
            login: 'jaham',
            imgUrl:
              'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 209,
        },
        {
          userPreview: {
            id: '106823',
            login: 'yotak',
            imgUrl:
              'https://cdn.intra.42.fr/users/a7a8b01cdd6e43d8b355cd64b3bdd841/yotak.jpg',
          },
          value: 180,
        },
      ],
      walletRanks: [
        {
          userPreview: {
            id: 99947,
            login: 'jaham',
            imgUrl:
              'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 2022,
        },
        {
          userPreview: {
            id: '112230',
            login: 'jeongble',
            imgUrl:
              'https://cdn.intra.42.fr/users/68000c4741c4493b400c15554c0170ea/jeongble.jpeg',
          },
          value: 1000,
        },
        {
          userPreview: {
            id: '85166',
            login: 'seunpark',
            imgUrl:
              'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
          },
          value: 995,
        },
      ],
      userCntPerLevels: [
        {
          userCnt: 25,
          level: 1,
        },
        {
          userCnt: 50,
          level: 2,
        },
        {
          userCnt: 40,
          level: 3,
        },
        {
          userCnt: 60,
          level: 4,
        },
        {
          userCnt: 10,
          level: 5,
        },
        {
          userCnt: 25,
          level: 6,
        },
        {
          userCnt: 50,
          level: 7,
        },
        {
          userCnt: 40,
          level: 8,
        },
        {
          userCnt: 60,
          level: 9,
        },
        {
          userCnt: 10,
          level: 10,
        },
      ],
    };
  }

  @ResolveField('projectInfo', (_returns) => ProjectInfo)
  async getProjectInfo(
    @Args('projectName', { defaultValue: 'libft' }) projectName: string,
  ) {
    if (projectName === 'ft_printf') {
      return {
        id: '1',
        name: 'ft_printf',
        skills: ['c', 'makefile'], //todo
        averagePassFinalmark: 115,
        averageDurationTime: 17,
        totalCloseCnt: 2000,
        currRegisteredCnt: 40,
        passPercentage: 30,
        totalEvalCnt: 2200,
      };
    }
    return {
      id: '2',
      name: 'libft',
      skills: ['c', 'makefile'], //todo
      averagePassFinalmark: 109,
      averageDurationTime: 17,
      totalCloseCnt: 1801,
      currRegisteredCnt: 80,
      passPercentage: 50,
      totalEvalCnt: 3392,
    };
  }

  @ResolveField('totalScores', (_returns) => [TotalScore])
  // todo: naming
  async totalScores(): Promise<TotalScore[]> {
    return await this.totalService.totalScores();
  }

  @ResolveField('scoreRecords', (_returns) => [ScoreRecords])
  async scoreRecords(): Promise<ScoreRecords[]> {
    return this.totalService.scoreRecords();
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
}
