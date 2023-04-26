import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { coalition } from './db/coalition.database.schema';

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
