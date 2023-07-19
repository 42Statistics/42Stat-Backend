import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { account } from 'src/api/account/db/account.database.schema';
import { HttpExceptionFilter } from 'src/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(account.name)
    private accountModel: Model<account>,
  ) {}

  async create(userId: number): Promise<account> {
    const newAccount = new this.accountModel({ userId });
    return await this.accountModel.create(newAccount);
  }

  async findOne(filter?: FilterQuery<account>): Promise<account | null> {
    return await this.accountModel.findOne(filter).lean();
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
