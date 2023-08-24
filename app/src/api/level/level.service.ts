import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  findAllAndLean,
  type QueryArgs,
} from 'src/database/mongoose/database.mongoose.query';
import { level } from './db/level.database.schema';

@Injectable()
export class LevelService {
  constructor(
    @InjectModel(level.name)
    private readonly levelModel: Model<level>,
  ) {}

  async findAllAndLean(queryArgs?: QueryArgs<level>): Promise<level[]> {
    return await findAllAndLean(this.levelModel, queryArgs);
  }
}
