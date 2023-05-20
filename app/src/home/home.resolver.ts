import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import {
  UserRanking,
  UserRankingDateRanged,
} from 'src/common/models/common.user.model';
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
      monthlyExpIncrementRank: [
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl:
              'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 8500,
        },
        {
          userPreview: {
            id: '2',
            login: 'yeju',
            imgUrl:
              'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
          },
          value: 7800,
        },
        {
          userPreview: {
            id: '3',
            login: 'seunpark',
            imgUrl:
              'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
          },
          value: 7250,
        },
        {
          userPreview: {
            id: '4',
            login: 'jayoon',
            imgUrl:
              'https://cdn.intra.42.fr/users/11edf4a6fddf61d0cb5588cb9cdb2a08/jayoon.jpg',
          },
          value: 7180,
        },
        {
          userPreview: {
            id: '5',
            login: 'seseo',
            imgUrl:
              'https://cdn.intra.42.fr/users/0936cfb132fd89dfb0aa4c99aca584b7/seseo.jpg',
          },
          value: 7011,
        },
      ],
      monthlyAccessTimeRank: [
        {
          userPreview: {
            id: '1',
            login: 'jaham',
            imgUrl:
              'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
          },
          value: 220,
        },
        {
          userPreview: {
            id: '2',
            login: 'yeju',
            imgUrl:
              'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
          },
          value: 208,
        },
        {
          userPreview: {
            id: '3',
            login: 'hyko',
            imgUrl:
              'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
          },
          value: 196,
        },
        {
          userPreview: {
            id: '4',
            login: 'mikim3',
            imgUrl:
              'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
          },
          value: 180,
        },
        {
          userPreview: {
            id: '5',
            login: 'junmoon',
            imgUrl:
              'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
          },
          value: 179,
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

  @ResolveField('totalEvalCountRank', (_returns) => [UserRanking])
  async totalEvalCountRank(): Promise<UserRanking[]> {
    return await this.homeService.totalEvalCountRank();
  }

  @ResolveField('monthlyEvalCountRank', (_returns) => UserRankingDateRanged)
  async monthlyEvalCountRank(): Promise<UserRankingDateRanged> {
    return await this.homeService.monthlyEvalCountRank();
  }

  @ResolveField('levelRank', (_returns) => UserRankingDateRanged)
  async levelRank(): Promise<UserRanking[]> {
    return await this.homeService.levelRank();
  }

  @ResolveField('lastMonthBlackholedCount', (_returns) => NumberDateRanged)
  async lastMonthBlackholedCount(): Promise<NumberDateRanged> {
    return await this.homeService.lastMonthblackholedCount();
  }

  @ResolveField('currMonthBlackholedCount', (_returns) => NumberDateRanged)
  async currMonthBlackholedCount(): Promise<NumberDateRanged> {
    return await this.homeService.currMonthblackholedCount();
  }

  //@ResolveField('getLevelRank', (_returns) => )
  //async getLevelRank() {
  //  return await this.homeService.
  //}
}
