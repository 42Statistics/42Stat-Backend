import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Total } from './models/total.model';
import { CoaliltionName, ProjectInfo } from './models/total.type';

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
      ],
      totalScores: [
        {
          coalitionName: CoaliltionName.GUN,
          score: 18000000,
        },
        {
          coalitionName: CoaliltionName.GON,
          score: 5000000,
        },
        {
          coalitionName: CoaliltionName.GAM,
          score: 19000000,
        },
        {
          coalitionName: CoaliltionName.LEE,
          score: 10000000,
        },
      ],
      correctionPointRanks: [
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
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
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
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
          value: 4242,
        },
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 3010,
        },
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 1880,
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
            id: '99947',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 7800,
        },
        {
          userPreview: {
            id: '99947',
            login: 'jaham',
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
          coalitionName: CoaliltionName.GUN,
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
          coalitionName: CoaliltionName.GON,
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
          coalitionName: CoaliltionName.GAM,
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
          coalitionName: CoaliltionName.LEE,
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
          userCnt: 100,
          point: 0, //todo: 음수 포함
        },
        {
          userCnt: 150,
          point: 1,
        },
        {
          userCnt: 50,
          point: 2,
        },
        {
          userCnt: 30,
          point: 3,
        },
        {
          userCnt: 20,
          point: 4,
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
      id: '1',
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
