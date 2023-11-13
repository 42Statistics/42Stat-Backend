import { InjectModel } from '@nestjs/mongoose';
import type {
  FindTeamCloseCountByDateInput,
  FindTeamCloseCountByDateOutput,
} from '../dailyTeamCloseCount.dto';
import { mv_daily_team_close_counts } from './dailyTeamCloseCount.database.schema';
import type { Model } from 'mongoose';

export type DailyTeamCloseCountDao = {
  findTeamCloseCountsByDate: (
    args: FindTeamCloseCountByDateInput,
  ) => Promise<FindTeamCloseCountByDateOutput[]>;
};

export class DailyTeamCloseClountDaoImpl implements DailyTeamCloseCountDao {
  constructor(
    @InjectModel(mv_daily_team_close_counts.name)
    private readonly dailyTeamCloseCount: Model<mv_daily_team_close_counts>,
  ) {}

  async findTeamCloseCountsByDate({
    start,
    end,
  }: FindTeamCloseCountByDateInput): Promise<FindTeamCloseCountByDateOutput[]> {
    return await this.dailyTeamCloseCount
      .find(
        {
          date: {
            $gte: start,
            $lt: end,
          },
        },
        {
          _id: 0,
          date: 1,
          count: 1,
        },
        {
          sort: { _id: 1 },
        },
      )
      .lean();
  }
}
