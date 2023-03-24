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
      projectTeamCnt: [
        {
          rank: 1,
          subject: 'libft',
          count: 320,
        },
        {
          rank: 2,
          subject: 'cub3d',
          count: 280,
        },
        {
          rank: 3,
          subject: 'ft_printf',
          count: 220,
        },
      ],
      monthlyExpIncrement: [
        {
          rank: 1,
          value: 8500,
          user: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
        {
          rank: 2,
          value: 7800,
          user: 'jaham',
          profileUrl: 'https://www.naver.com',
        },
      ],
      monthlyAccessTime: [
        {
          rank: 1,
          value: 220,
          user: 'jaham',
          profileUrl: 'https://www.naver.com',
        },
        {
          rank: 2,
          value: 208,
          user: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
      ],
      totalEvalCnt: [
        {
          rank: 1,
          value: 501,
          user: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
        {
          rank: 2,
          value: 408,
          user: 'jaham',
          profileUrl: 'https://www.naver.com',
        },
      ],
      level: [
        {
          rank: 1,
          value: 14.05,
          user: 'yopark',
          profileUrl: 'https://www.naver.com',
        },
      ],
      lastExamPassRate: {
        info: [
          { rank: 2, passed: 9, total: 20, percentage: 9 / 20 },
          { rank: 3, passed: 3, total: 20, percentage: 3 / 20 },
          { rank: 4, passed: 4, total: 12, percentage: 4 / 12 },
          { rank: 5, passed: 8, total: 18, percentage: 8 / 18 },
          { rank: 6, passed: 1, total: 10, percentage: 1 / 10 },
        ],
      },
    };
  }
}
