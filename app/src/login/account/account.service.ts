import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import {
  findAll,
  findOne,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import {
  account,
  type AccountDocument,
} from 'src/login/account/db/account.database.schema';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(account.name)
    private readonly accountModel: Model<account>,
  ) {}

  async createIfNotExist(userId: number): Promise<account> {
    const user = await this.accountModel.findOne({ userId });

    if (!user) {
      return await this.accountModel.create({ userId });
    }

    return user;
  }

  async findAll(
    queryOneArgs: QueryOneArgs<account>,
  ): Promise<AccountDocument[] | null> {
    return await findAll(queryOneArgs)(this.accountModel);
  }

  async findOne(
    queryOneArgs: QueryOneArgs<account>,
  ): Promise<AccountDocument | null> {
    return await findOne(queryOneArgs)(this.accountModel);
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
