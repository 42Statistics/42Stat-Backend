import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRanking } from 'src/common/models/common.user.model';
import { HomeService } from './home.service';
import { Home } from './models/home.model';

@Resolver((_of: unknown) => Home)
export class HomeResolver {
  constructor(private homeService: HomeService) {}

  @Query((_returns) => Home)
  async getHomePage() {
    return {
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
            id: '2',
            name: 'libft',
          },
          value: 280,
        },
        {
          projectPreview: {
            id: '3',
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
            id: '2',
            login: 'yeju',
            imgUrl: 'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
          },
          value: 7800,
        },
        {
          userPreview: {
            id: '3',
            login: 'seunpark',
            imgUrl: 'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
          },
          value: 7250,
        },
        {
          userPreview: {
            id: '4',
            login: 'jayoon',
            imgUrl: 'https://cdn.intra.42.fr/users/11edf4a6fddf61d0cb5588cb9cdb2a08/jayoon.jpg',
          },
          value: 7180,
        },
        {
          userPreview: {
            id: '5',
            login: 'seseo',
            imgUrl: 'https://cdn.intra.42.fr/users/0936cfb132fd89dfb0aa4c99aca584b7/seseo.jpg',
          },
          value: 7011,
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
            id: '2',
            login: 'yeju',
            imgUrl: 'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
          },
          value: 208,
        },
        {
          userPreview: {
            id: '3',
            login: 'hyko',
            imgUrl: 'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
          },
          value: 196,
        },
        {
          userPreview: {
            id: '4',
            login: 'mikim3',
            imgUrl: 'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
          },
          value: 180,
        },
        {
          userPreview: {
            id: '5',
            login: 'junmoon',
            imgUrl: 'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
          },
          value: 179,
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
        {
          userPreview: {
            id: '2',
            login: 'hyulim',
            imgUrl: 'https://cdn.intra.42.fr/users/a7d0022dd8ba3c74f20cb83ceaac0c88/hyulim.jpg',
          },
          value: 13.88,
        },
        {
          userPreview: {
            id: '3',
            login: 'yongmkim',
            imgUrl: 'https://cdn.intra.42.fr/users/60f2b806f6ee8a76585ef22a666474d5/yongmkim.JPG',
          },
          value: 13.76,
        },
      ],
      lastExamResult: [
        { rank: 2, passCnt: 9, totalCnt: 20 },
        { rank: 3, passCnt: 3, totalCnt: 20 },
        { rank: 4, passCnt: 4, totalCnt: 12 },
        { rank: 5, passCnt: 8, totalCnt: 18 },
        { rank: 6, passCnt: 1, totalCnt: 10 },
      ],
    };
  }

  @ResolveField('currWeekEvalCnt', (_returns) => Number)
  async currWeekEvalCnt(): Promise<number> {
    return await this.homeService.currWeekEvalCnt();
  }

  @ResolveField('lastWeekEvalCnt', (_returns) => Number)
  async lastWeekEvalCnt(): Promise<number> {
    return await this.homeService.lastWeekEvalCnt();
  }

  @ResolveField('totalEvalCntRank', (_returns) => [UserRanking])
  async totalEvalCntRank(): Promise<UserRanking[]> {
    return await this.homeService.totalEvalCntRank();
  }

  @ResolveField('monthlyEvalCntRank', (_returns) => [UserRanking])
  async monthlyEvalCntRank(): Promise<UserRanking[]> {
    return await this.homeService.monthlyEvalCntRank();
  }
}
