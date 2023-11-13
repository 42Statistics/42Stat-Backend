import { Injectable } from '@nestjs/common';
import { DailyCoalitionScoreDaoImpl } from './db/dailyCoalitionScore.database.dao';
import { ScoreRecordPerCoalition } from 'src/page/home/coalition/models/home.coalition.model';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { CoalitionService } from 'src/api/coalition/coalition.service';

@Injectable()
export class DailyCoalitionScoreService {
  constructor(
    private readonly dailyCoalitionScoreDao: DailyCoalitionScoreDaoImpl,
    private readonly coalitionService: CoalitionService,
  ) {}

  async scoreRecordsPerCoalitions({
    start,
    end,
  }: DateRange): Promise<ScoreRecordPerCoalition[]> {
    const scoresPerCoalition =
      await this.dailyCoalitionScoreDao.findScoresPerCoalitionByDate({
        start,
        end,
      });

    return scoresPerCoalition.map(({ coalition, scores }) => ({
      coalition: this.coalitionService.daoToDto(coalition),
      records: scores.map(({ date, value }) => ({ at: date, value })),
    }));
  }
}
