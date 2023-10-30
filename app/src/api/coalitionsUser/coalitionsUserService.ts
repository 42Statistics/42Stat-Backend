import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { coalitions_user } from './db/coalitionsUser.database.schema';
import type { Model } from 'mongoose';

@Injectable()
export class CoalitionsUserService {
  constructor(
    @InjectModel(coalitions_user.name)
    private readonly coalitionsUserModel: Model<coalitions_user>,
  ) {}

  async findCoalitionsUserByUserIdAndLean(
    userId: number,
  ): Promise<coalitions_user | null> {
    return await this.coalitionsUserModel
      .findOne({
        userId,
      })
      .lean();
  }
}
