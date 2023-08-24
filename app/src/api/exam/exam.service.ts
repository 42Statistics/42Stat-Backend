import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findOneAndLean,
  type QueryOneArgs,
} from 'src/database/mongoose/database.mongoose.query';
import { exam } from './db/exam.database.schema';

export const EXAM_PROJECT_IDS = [1320, 1321, 1322, 1323, 1324];

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(exam.name)
    private readonly examModel: Model<exam>,
  ) {}

  async findOneAndLean(
    queryOneArgs?: QueryOneArgs<exam>,
  ): Promise<exam | null> {
    return await findOneAndLean(this.examModel, queryOneArgs);
  }
}
