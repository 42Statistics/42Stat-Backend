import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CoaliltionName } from 'src/common/models/common.coalition.model';
import { ProjectInfo, Total } from './models/total.model';

@Resolver((_of: unknown) => Total)
export class TotalResolver {
  constructor() {}

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
      totalScores: [
        {
          coalition: {
            id: '1',
            name: CoaliltionName.GUN,
          },
          score: 18000000,
        },
        {
          coalition: {
            id: '2',
            name: CoaliltionName.GUN,
          },
          score: 5000000,
        },
        {
          coalition: {
            id: '3',
            name: CoaliltionName.GUN,
          },
          score: 19000000,
        },
        {
          coalition: {
            id: '4',
            name: CoaliltionName.GUN,
          },
          score: 10000000,
        },
      ],
      correctionPointRanks: [
        {
          userPreview: {
            id: '99756',
            login: 'yuhwang',
            imgUrl: 'https://cdn.intra.42.fr/users/229c609882b1f47557bad820b39cd65a/yuhwang.jpeg',
          },
          value: 240,
        },
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 209,
        },
        {
          userPreview: {
            id: '106823',
            login: 'yotak',
            imgUrl: 'https://cdn.intra.42.fr/users/a7a8b01cdd6e43d8b355cd64b3bdd841/yotak.jpg',
          },
          value: 180,
        },
      ],
      walletRanks: [
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 2022,
        },
        {
          userPreview: {
            id: '112230',
            login: 'jeongble',
            imgUrl: 'https://cdn.intra.42.fr/users/68000c4741c4493b400c15554c0170ea/jeongble.jpeg',
          },
          value: 1000,
        },
        {
          userPreview: {
            id: '85166',
            login: 'seunpark',
            imgUrl: 'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
          },
          value: 995,
        },
      ],
      monthlyScoreRanks: [
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 8500,
        },
        {
          userPreview: {
            id: '145733',
            login: 'iam0',
            imgUrl: 'https://cdn.intra.42.fr/users/af0e421a2d94c02f25ff9aed443f783a/iam0.jpg',
          },
          value: 7800,
        },
        {
          userPreview: {
            id: '1',
            login: 'MMMMMMMM',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 7250,
        },
      ],
      totalEvalCnt: 87102,
      averageFeedbackLength: 88,
      averageCircleDurations: [
        {
          circle: 0,
          value: 7,
        },
        {
          circle: 1,
          value: 10,
        },
        {
          circle: 2,
          value: 55,
        },
        {
          circle: 3,
          value: 107,
        },
        {
          circle: 4,
          value: 204,
        },
        {
          circle: 5,
          value: 307,
        },
        {
          circle: 6,
          value: 390,
        },
      ],
      scoreRecords: [
        {
          coalition: {
            id: '1',
            name: CoaliltionName.GUN,
          },
          records: [
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
          ],
        },
        {
          coalition: {
            id: '2',
            name: CoaliltionName.GUN,
          },
          records: [
            {
              at: new Date('2022-11-01T00:00:00.405Z'),
              value: 2250,
            },
            {
              at: new Date('2022-12-01T00:00:00.405Z'),
              value: 1000,
            },
            {
              at: new Date('2023-01-01T00:00:00.405Z'),
              value: 750,
            },
            {
              at: new Date('2023-02-01T00:00:00.405Z'),
              value: 3000,
            },
            {
              at: new Date('2023-03-01T00:00:00.405Z'),
              value: 1500,
            },
          ],
        },
        {
          coalition: {
            id: '3',
            name: CoaliltionName.GUN,
          },
          records: [
            {
              at: new Date('2022-11-01T00:00:00.405Z'),
              value: 1500,
            },
            {
              at: new Date('2022-12-01T00:00:00.405Z'),
              value: 2750,
            },
            {
              at: new Date('2023-01-01T00:00:00.405Z'),
              value: 1000,
            },
            {
              at: new Date('2023-02-01T00:00:00.405Z'),
              value: 3900,
            },
            {
              at: new Date('2023-03-01T00:00:00.405Z'),
              value: 4750,
            },
          ],
        },
        {
          coalition: {
            id: '4',
            name: CoaliltionName.GUN,
          },
          records: [
            {
              at: new Date('2022-11-01T00:00:00.405Z'),
              value: 1800,
            },
            {
              at: new Date('2022-12-01T00:00:00.405Z'),
              value: 1550,
            },
            {
              at: new Date('2023-01-01T00:00:00.405Z'),
              value: 1550,
            },
            {
              at: new Date('2023-02-01T00:00:00.405Z'),
              value: 3000,
            },
            {
              at: new Date('2023-03-01T00:00:00.405Z'),
              value: 1750,
            },
          ],
        },
      ],
      userCntPerPoints: [
        {
          userCnt: 6,
          point: -2,
        },
        {
          userCnt: 13,
          point: -1,
        },
        {
          userCnt: 403,
          point: 0,
        },
        {
          userCnt: 150,
          point: 1,
        },
        {
          userCnt: 30,
          point: 2,
        },
        {
          userCnt: 20,
          point: 3,
        },
        //todo: 피그마처럼 3씩 나눠서 하기
      ],
      evalCntPerPoints: [
        {
          evalCnt: 20,
          point: 0,
        },
        {
          evalCnt: 40,
          point: 1,
        },
        {
          evalCnt: 10,
          point: 2,
        },
        {
          evalCnt: 3,
          point: 3,
        },
        {
          evalCnt: 1,
          point: 4,
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
  async getProjectInfo(@Args('projectName', { defaultValue: 'libft' }) projectName: string) {
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
}
