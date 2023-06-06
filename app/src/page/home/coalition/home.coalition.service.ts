import { Injectable } from '@nestjs/common';
import { SEOUL_COALITION_ID } from 'src/api/coalition/coalition.service';
import { ScoreService } from 'src/api/score/score.service';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { Time } from 'src/util';
import type {
  ScoreRecordPerCoalition,
  IntPerCoalition,
} from './models/home.coalition.model';

@Injectable()
export class HomeCoalitionService {
  constructor(
    private scoreService: ScoreService,
    private dateRangeService: DateRangeService,
  ) {}

  async totalScoresPerCoalition(): Promise<IntPerCoalition[]> {
    return await this.scoreService.scoresPerCoalition();
  }

  async scoreRecordsPerCoalition(): Promise<ScoreRecordPerCoalition[]> {
    const currMonth = Time.startOfMonth(Time.now());
    const lastYear = Time.moveYear(currMonth, -1);

    const dateRange: DateRange = {
      start: lastYear,
      end: currMonth,
    };

    return await this.scoreService.scoreRecordsPerCoalition({
      createdAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
      coalitionsUserId: { $ne: null },
      coalitionId: { $in: SEOUL_COALITION_ID },
    });
  }

  async tigCountPerCoalitions(): Promise<IntPerCoalition[]> {
    return [
      {
        coalition: {
          id: 85,
          name: 'Gun',
          slug: 'gun',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/85/gun-svg-svg.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/85/gun_cover.jpg',
          color: '#ffc221',
          score: 73891,
          userId: 107096,
        },
        value: 5,
      },
      {
        coalition: {
          id: 86,
          name: 'Gon',
          slug: 'gon',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/86/gon-svg-svg.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/86/gon_cover.jpg',
          color: '#559f7a',
          score: 71588,
          userId: 99953,
        },
        value: 10,
      },
      {
        coalition: {
          id: 87,
          name: 'Gam',
          slug: 'gam',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/87/gam-svg-svg__3_.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/87/gam_cover.jpg',
          color: '#4c83a4',
          score: 56873,
          userId: 103943,
        },
        value: 15,
      },
      {
        coalition: {
          id: 88,
          name: 'Lee',
          slug: 'lee',
          imageUrl:
            'https://cdn.intra.42.fr/coalition/image/88/lee-svg-svg_1_.svg',
          coverUrl: 'https://cdn.intra.42.fr/coalition/cover/88/lee_cover.jpg',
          color: '#bb4140',
          score: 58545,
          userId: 99733,
        },
        value: 20,
      },
    ];
  }
}
