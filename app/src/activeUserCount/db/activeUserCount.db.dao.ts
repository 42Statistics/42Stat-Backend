import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RUNTIME_CONFIG } from 'src/config/runtime';
import { mv_active_user_counts } from './activeUserCount.db.schema';
import {
  FindAllActiveUserCountByDateInput,
  FindAllActiveUserCountByDateOutput,
} from './activeUserCount.db.dto';

@Injectable()
export class ActiveUserCountDao {
  constructor(
    @InjectModel(mv_active_user_counts.name)
    private readonly activeUserCountModel: Model<mv_active_user_counts>,
    @Inject(RUNTIME_CONFIG.KEY)
    private readonly runtimeConfig: ConfigType<typeof RUNTIME_CONFIG>,
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
