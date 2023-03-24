import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Total } from './models/total.model';
import { coaliltionEnum, subjectInfoType } from './models/total.type';

@Resolver((_of: unknown) => Total)
export class TotalResolver {
  constructor() {}

  @Query((_returns) => Total)
  async getTotalPage() {
    return {
      activeUserCnt: [
        {
          At: new Date('2022-11-01T00:00:00.405Z'),
          value: 1000,
        },
        {
          At: new Date('2022-12-01T00:00:00.405Z'),
          value: 2250,
        },
        {
          At: new Date('2023-01-01T00:00:00.405Z'),
          value: 1500,
        },
        {
          At: new Date('2023-02-01T00:00:00.405Z'),
          value: 3000,
        },
        {
          At: new Date('2023-03-01T00:00:00.405Z'),
          value: 750,
        },
      ],
      blackholedCircle: [
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
      totalCoalitionScore: [
        {
          coalition: coaliltionEnum.GUN,
          score: 18000000,
        },
        {
          coalition: coaliltionEnum.GON,
          score: 5000000,
        },
        {
          coalition: coaliltionEnum.GAM,
          score: 19000000,
        },
        {
          coalition: coaliltionEnum.LEE,
          score: 10000000,
        },
      ],
      evalPoint: [
        {
          rank: 1,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 240,
        },
        {
          rank: 2,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 209,
        },
        {
          rank: 3,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 180,
        },
      ],
      wallet: [
        {
          rank: 1,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 4242,
        },
        {
          rank: 2,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 3010,
        },
        {
          rank: 3,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 1880,
        },
      ],
      monthlyCoalitionScore: [
        {
          rank: 1,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 8500,
        },
        {
          rank: 2,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 7800,
        },
        {
          rank: 3,
          user: 'yopark',
          profileUrl: 'http://www.naver.com',
          value: 7250,
        },
      ],
      totalEvalCnt: 87102,
      averageAllFeedbackLength: 88,
      durationDaybyCircle: [
        {
          circle: 0,
          durationDay: 7,
        },
        {
          circle: 1,
          durationDay: 10,
        },
        {
          circle: 2,
          durationDay: 55,
        },
        {
          circle: 3,
          durationDay: 107,
        },
        {
          circle: 4,
          durationDay: 204,
        },
        {
          circle: 5,
          durationDay: 307,
        },
        {
          circle: 6,
          durationDay: 390,
        },
      ],
      coalitionScoreChange: [
        {
          coalition: coaliltionEnum.GUN,
          info: [
            {
              At: new Date('2022-11-01T00:00:00.405Z'),
              value: 1000,
            },
            {
              At: new Date('2022-12-01T00:00:00.405Z'),
              value: 2250,
            },
            {
              At: new Date('2023-01-01T00:00:00.405Z'),
              value: 1500,
            },
            {
              At: new Date('2023-02-01T00:00:00.405Z'),
              value: 3000,
            },
            {
              At: new Date('2023-03-01T00:00:00.405Z'),
              value: 750,
            },
          ],
        },
        {
          coalition: coaliltionEnum.GON,
          info: [
            {
              At: new Date('2022-11-01T00:00:00.405Z'),
              value: 2250,
            },
            {
              At: new Date('2022-12-01T00:00:00.405Z'),
              value: 1000,
            },
            {
              At: new Date('2023-01-01T00:00:00.405Z'),
              value: 750,
            },
            {
              At: new Date('2023-02-01T00:00:00.405Z'),
              value: 3000,
            },
            {
              At: new Date('2023-03-01T00:00:00.405Z'),
              value: 1500,
            },
          ],
        },
        {
          coalition: coaliltionEnum.GAM,
          info: [
            {
              At: new Date('2022-11-01T00:00:00.405Z'),
              value: 1500,
            },
            {
              At: new Date('2022-12-01T00:00:00.405Z'),
              value: 2750,
            },
            {
              At: new Date('2023-01-01T00:00:00.405Z'),
              value: 1000,
            },
            {
              At: new Date('2023-02-01T00:00:00.405Z'),
              value: 3900,
            },
            {
              At: new Date('2023-03-01T00:00:00.405Z'),
              value: 4750,
            },
          ],
        },
        {
          coalition: coaliltionEnum.LEE,
          info: [
            {
              At: new Date('2022-11-01T00:00:00.405Z'),
              value: 1800,
            },
            {
              At: new Date('2022-12-01T00:00:00.405Z'),
              value: 1550,
            },
            {
              At: new Date('2023-01-01T00:00:00.405Z'),
              value: 1550,
            },
            {
              At: new Date('2023-02-01T00:00:00.405Z'),
              value: 3000,
            },
            {
              At: new Date('2023-03-01T00:00:00.405Z'),
              value: 1750,
            },
          ],
        },
      ],
      userCntByPoint: [
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
      evalCntByPoint: [
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
      userCntByLevel: [
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

  @ResolveField('subjectName', (_returns) => [subjectInfoType])
  async getSubjectInfo(
    @Args('subjectName', { defaultValue: 'libft' }) subjectName: string,
  ) {
    if (subjectName === 'ft_printf') {
      return [
        {
          subjectBase: {
            name: 'ft_printf',
            url: 'http://www.naver.com',
          },
          subjectDetail: {
            skills: [3, 4], //todo
            averagePassScore: 115,
            averageDurationTime: 17,
            totalSubmissionsCnt: 2000,
            currTeamCount: 40,
          },
          subjectPass: {
            passPercentage: 30,
            totalEvalCnt: 2200,
          },
        },
      ];
    }
    return [
      {
        subjectBase: {
          name: 'libft',
          url: 'http://www.naver.com',
        },
        subjectDetail: {
          skills: [1, 2], //todo
          averagePassScore: 109,
          averageDurationTime: 17,
          totalSubmissionsCnt: 1801,
          currTeamCount: 80,
        },
        subjectPass: {
          passPercentage: 50,
          totalEvalCnt: 3392,
        },
      },
    ];
  }
}
