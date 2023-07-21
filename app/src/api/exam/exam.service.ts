import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findAll,
  findOne,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
import { exam, type ExamDocument } from './db/exam.database.schema';

export const EXAM_PROJECT_IDS = [1320, 1321, 1322, 1323, 1324];

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(exam.name)
    private readonly examModel: Model<exam>,
  ) {}

  async findAll(queryArgs?: QueryArgs<exam>): Promise<ExamDocument[]> {
    return await findAll(queryArgs)(this.examModel);
  }

  async findOne(
    queryOneArgs?: QueryOneArgs<exam>,
  ): Promise<ExamDocument | null> {
    const exam = await findOne(queryOneArgs)(this.examModel);

    if (!exam) {
      throw new NotFoundException();
    }

    return exam;
  }
}
