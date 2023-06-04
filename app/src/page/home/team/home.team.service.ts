import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeTeamService {
  async temp() {
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
      lastExamResult: {
        data: [
          { rank: 2, passCount: 9, totalCount: 20 },
          { rank: 3, passCount: 3, totalCount: 20 },
          { rank: 4, passCount: 4, totalCount: 12 },
          { rank: 5, passCount: 8, totalCount: 18 },
          { rank: 6, passCount: 1, totalCount: 10 },
        ],
        start: new Date(),
        end: new Date(),
      },
    };
  }
}
