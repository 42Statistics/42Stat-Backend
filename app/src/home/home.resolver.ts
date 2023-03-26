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
          projectPreview: {
            id: '1',
            name: 'ft_ping',
          },
          value: 320,
        },
        {
          projectPreview: {
            id: '1',
            name: 'libft',
          },
          value: 280,
        },
        {
          projectPreview: {
            id: '1',
            name: 'get_next_line',
          },
          value: 220,
        },
      ],
      monthlyExpIncrementRank: [
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 8500,
        },
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 7800,
        },
      ],
      monthlyAccessTimeRank: [
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 220,
        },
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 208,
        },
      ],
      totalEvalCntRank: [
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 501,
        },
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 408,
        },
      ],
      levelRank: [
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl: 'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 14.05,
        },
      ],
      lastExamResult: [
        { rank: 2, passCnt: 9, total: 20 },
        { rank: 3, passCnt: 3, total: 20 },
        { rank: 4, passCnt: 4, total: 12 },
        { rank: 5, passCnt: 8, total: 18 },
        { rank: 6, passCnt: 1, total: 10 },
      ],
    };
  }
}
