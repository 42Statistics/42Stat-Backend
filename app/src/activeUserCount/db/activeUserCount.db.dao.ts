import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FindAllActiveUserCountByDateInput,
  FindAllActiveUserCountByDateOutput,
} from './activeUserCount.db.dto';
import { mv_active_user_counts } from './activeUserCount.db.schema';

@Injectable()
export class ActiveUserCountDao {
  constructor(
    @InjectModel(mv_active_user_counts.name)
    private readonly activeUserCountModel: Model<mv_active_user_counts>,
  ) {}

  async findAllByDate(
    input: FindAllActiveUserCountByDateInput,
  ): Promise<FindAllActiveUserCountByDateOutput> {
    return await this.activeUserCountModel.find(
      { date: { $gte: input.start, $lt: input.end } },
      { _id: 0, date: 1, count: 1 },
      { sort: { date: 1 } },
    );
  }
}
