import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LevelDocument, level } from './db/level.database.schema';
import { Model } from 'mongoose';
import type { QueryArgs } from 'src/common/db/common.db.query';

@Injectable()
export class LevelService {
  constructor(
    @InjectModel(level.name)
    private levelModel: Model<level>,
  ) {}

  async findAll(
    queryArgs?: Partial<QueryArgs<level>>,
  ): Promise<LevelDocument[]> {
    const query = this.levelModel.find(queryArgs?.filter ?? {});

    if (queryArgs?.sort) {
      query.sort(queryArgs.sort);
    }

    if (queryArgs?.limit) {
      query.limit(queryArgs.limit);
    }

    return await query;
  }
}
