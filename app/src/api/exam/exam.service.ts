import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { QueryArgs } from 'src/common/db/common.db.query';
import { exam, ExamDocument } from './db/exam.database.schema';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(exam.name)
    private examModel: Model<exam>,
  ) {}

  async findAll(queryArgs?: Partial<QueryArgs<exam>>): Promise<ExamDocument[]> {
    const query = this.examModel.find(queryArgs?.filter ?? {});

    if (queryArgs?.select) {
      query.select(queryArgs.select);
    }

    if (queryArgs?.sort) {
      query.sort(queryArgs.sort);
    }

    if (queryArgs?.skip) {
      query.skip(queryArgs.skip);
    }

    if (queryArgs?.limit) {
      query.limit(queryArgs.limit);
    }

    return await query;
  }

  async findOne(queryArgs?: QueryArgs<exam>): Promise<ExamDocument | null> {
    const query = this.examModel.findOne(queryArgs?.filter ?? {});

    if (queryArgs?.select) {
      query.select(queryArgs.select);
    }

    if (queryArgs?.sort) {
      query.sort(queryArgs.sort);
    }

    if (queryArgs?.skip) {
      query.skip(queryArgs.skip);
    }

    if (queryArgs?.limit) {
      query.limit(queryArgs.limit);
    }

    const exam = await query;

    if (!exam) {
      throw new NotFoundException();
    }

    return exam;
  }
}
