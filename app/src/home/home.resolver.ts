import { Query, Resolver } from '@nestjs/graphql';
import { Home } from './models/home.model';

@Resolver((_of: unknown) => Home)
export class HomeResolver {
  constructor() {}

  @Query((_returns) => Home)
  async getHomePage() {
    return {
      currWeekEvalCnt: 3330,
      lastWeekEvalCnt: 320,
      lastMonthBlackholedCnt: 30,
      currMonthBlackholedCnt: 31,
      currRegisteredCntRank: [
        {
          rank: 1,
          projectName: 'libft',
          value: 320,
        },
        {
          rank: 2,
          projectName: 'cub3d',
          value: 280,
        },
        {
          rank: 3,
          projectName: 'ft_printf',
          value: 220,
        },
      ],
      monthlyExpIncrementRank: [
        {
          rank: 1,
          value: 8500,
          userName: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
        {
          rank: 2,
          value: 7800,
          userName: 'jaham',
          profileUrl: 'https://www.naver.com',
        },
      ],
      monthlyAccessTimeRank: [
        {
          rank: 1,
          value: 220,
          userName: 'jaham',
          profileUrl: 'https://www.naver.com',
        },
        {
          rank: 2,
          value: 208,
          userName: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
      ],
      totalEvalCntRank: [
        {
          rank: 1,
          value: 501,
          userName: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
        {
          rank: 2,
          value: 408,
          userName: 'jaham',
          profileUrl: 'https://www.naver.com',
        },
      ],
      levelRank: [
        {
          rank: 1,
          value: 14.05,
          userName: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
      ],
      lastExamPassRate: [
        { rank: 2, passCnt: 9, total: 20 },
        { rank: 3, passCnt: 3, total: 20 },
        { rank: 4, passCnt: 4, total: 12 },
        { rank: 5, passCnt: 8, total: 18 },
        { rank: 6, passCnt: 1, total: 10 },
      ],
    };
  }
}
