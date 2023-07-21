import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { findAll, type QueryArgs } from 'src/common/db/common.db.query';
import { level, type LevelDocument } from './db/level.database.schema';

@Injectable()
export class LevelService {
  constructor(
    @InjectModel(level.name)
    private readonly levelModel: Model<level>,
  ) {}

  async findAll(queryArgs?: QueryArgs<level>): Promise<LevelDocument[]> {
    return await findAll(queryArgs)(this.levelModel);
  }
}
