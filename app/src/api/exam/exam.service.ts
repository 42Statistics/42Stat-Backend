import { Inject, Injectable } from '@nestjs/common';
import { exam } from './db/exam.database.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class ExamService {
  constructor(
    @Inject(exam.name)
    private examModel: Model<exam>,
  ) {}

  async findOne(filter?: FilterQuery<exam>): Promise<exam | null> {
    return await this.examModel.findOne(filter);
  }
}
