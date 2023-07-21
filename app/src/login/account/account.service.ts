import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { type QueryOneArgs, findOne } from 'src/common/db/common.db.query';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import {
  type AccountDocument,
  account,
} from 'src/login/account/db/account.database.schema';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(account.name)
    private readonly accountModel: Model<account>,
  ) {}

  async create(userId: number): Promise<account> {
    return await this.accountModel.create({ userId });
  }

  async findOne(
    queryOneArgs: QueryOneArgs<account>,
  ): Promise<AccountDocument | null> {
    return await findOne(queryOneArgs)(this.accountModel).lean();
  }

  async findOneAndUpdate(
    filter: FilterQuery<account>,
    update: UpdateQuery<account>,
    options?: QueryOptions<account>,
  ): Promise<account | null> {
    return await this.accountModel.findOneAndUpdate(filter, update, options);
  }

  async deleteOne(filter?: FilterQuery<account>): Promise<number> {
    const { deletedCount } = await this.accountModel.deleteOne(filter);
    return deletedCount;
  }
}
