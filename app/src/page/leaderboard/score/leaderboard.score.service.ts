import { Injectable } from '@nestjs/common';
import { UserRanking } from 'src/common/models/common.user.model';

@Injectable()
export class LeaderboardScoreService {
  async scoreRank(start: Date, end: Date): Promise<UserRanking[]> {
    return [
      {
        userPreview: {
          id: 1,
          login: 'jaham',
          imgUrl:
            'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
        },
        value: 220,
      },
      {
        userPreview: {
          id: 2,
          login: 'yeju',
          imgUrl:
            'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
        },
        value: 208,
      },
      {
        userPreview: {
          id: 3,
          login: 'hyko',
          imgUrl:
            'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
        },
        value: 196,
      },
      {
        userPreview: {
          id: 4,
          login: 'mikim3',
          imgUrl:
            'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
        },
        value: 180,
      },
      {
        userPreview: {
          id: 5,
          login: 'junmoon',
          imgUrl:
            'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
        },
        value: 179,
      },
    ];
  }

  async totalScoreRank(): Promise<UserRanking[]> {
    return [
      {
        userPreview: {
          id: 1,
          login: 'jaham',
          imgUrl:
            'https://cdn.intra.42.fr/users/cfc5b84fa9130d86b32acec4aae7889f/jaham.jpg',
        },
        value: 220,
      },
      {
        userPreview: {
          id: 2,
          login: 'yeju',
          imgUrl:
            'https://cdn.intra.42.fr/users/c0f2c1d395758195af43b4301b66d99d/yeju.jpg',
        },
        value: 208,
      },
      {
        userPreview: {
          id: 3,
          login: 'hyko',
          imgUrl:
            'https://cdn.intra.42.fr/users/815da09d079333a9bbe06d1a69ecbaa9/hyko.jpg',
        },
        value: 196,
      },
      {
        userPreview: {
          id: 4,
          login: 'mikim3',
          imgUrl:
            'https://cdn.intra.42.fr/users/fc2fef7bd868d0d7a4cc170da7342d5a/mikim3.jpg',
        },
        value: 180,
      },
      {
        userPreview: {
          id: 5,
          login: 'junmoon',
          imgUrl:
            'https://cdn.intra.42.fr/users/42901c590a20d5796ade2e2c963bd7ec/junmoon.jpg',
        },
        value: 179,
      },
    ];
  }
}
