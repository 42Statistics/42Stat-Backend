import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, Model } from 'mongoose';
import { findAll, type QueryArgs } from 'src/common/db/common.db.query';
import { coalition } from './db/coalition.database.schema';

export const SEOUL_COALITION_ID = [85, 86, 87, 88] as const;

@Injectable()
export class CoalitionService {
  constructor(
    @InjectModel(coalition.name)
    private readonly coalitionModel: Model<coalition>,
  ) {}

  async findAll(queryArgs?: QueryArgs<coalition>): Promise<coalition[]> {
    return await findAll(queryArgs)(this.coalitionModel);
  }

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.coalitionModel.aggregate<ReturnType>();
  }
}
