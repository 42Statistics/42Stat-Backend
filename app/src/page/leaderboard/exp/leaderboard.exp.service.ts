import { Injectable } from '@nestjs/common';
import { UserRanking } from 'src/common/models/common.user.model';

@Injectable()
export class LeaderboardExpService {
  async expIncrementRank(start: Date, end: Date): Promise<UserRanking[]> {
    return [
      {
        userPreview: {
          id: 1,
          login: 'jaham',
          imgUrl:
            'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
        },
        value: 8500,
      },
      {
        userPreview: {
          id: 2,
          login: 'yeju',
          imgUrl:
            'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
        },
        value: 7800,
      },
      {
        userPreview: {
          id: 3,
          login: 'seunpark',
          imgUrl:
            'https://cdn.intra.42.fr/users/e47ea718a318076d34edc53e2fe90caf/seunpark.gif',
        },
        value: 7250,
      },
      {
        userPreview: {
          id: 4,
          login: 'jayoon',
          imgUrl:
            'https://cdn.intra.42.fr/users/11edf4a6fddf61d0cb5588cb9cdb2a08/jayoon.jpg',
        },
        value: 7180,
      },
      {
        userPreview: {
          id: 5,
          login: 'seseo',
          imgUrl:
            'https://cdn.intra.42.fr/users/0936cfb132fd89dfb0aa4c99aca584b7/seseo.jpg',
        },
        value: 7011,
      },
    ];
  }
}
