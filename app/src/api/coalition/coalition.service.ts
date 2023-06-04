import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { coalition } from './db/coalition.database.schema';

export const SEOUL_COALITION_ID = [85, 86, 87, 88] as const;

@Injectable()
export class CoalitionService {
  constructor(
    @InjectModel(coalition.name)
    private coalitionModel: Model<coalition>,
  ) {}

  async findAll(): Promise<coalition[]> {
    return await this.coalitionModel.find();
  }
}
