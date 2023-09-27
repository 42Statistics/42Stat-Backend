import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findAllAndLean,
  type QueryArgs,
} from 'src/database/mongoose/database.mongoose.query';
import { promos_user } from './db/promosUser.database.schema';

@Injectable()
export class PromosUserService {
  constructor(
    @InjectModel(promos_user.name)
    private readonly promosUserModel: Model<promos_user>,
  ) {}

  async findAllAndLean(
    queryArgs: QueryArgs<promos_user>,
  ): Promise<promos_user[]> {
    return await findAllAndLean(this.promosUserModel, queryArgs);
  }
}
