import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import {
  UpdateQueryArgs,
  findOne,
  findOneAndLean,
  findOneAndUpdateAndLean,
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
    const queryOneArgs: QueryOneArgs<account> = { filter: { userId } };

    const user = await findOneAndLean(queryOneArgs)(this.accountModel);

    if (!user) {
      return await this.accountModel.create({ userId });
    }

    return user;
  }

  async findOne(
    queryOneArgs: QueryOneArgs<account>,
  ): Promise<AccountDocument | null> {
    return await findOne(queryOneArgs)(this.accountModel);
  }

  async findOneAndLean(
    queryOneArgs: QueryOneArgs<account>,
  ): Promise<account | null> {
    return await findOneAndLean(queryOneArgs)(this.accountModel);
  }

  async findOneAndUpdateAndLean(
    updateQueryArgs: UpdateQueryArgs<account>,
  ): Promise<account | null> {
    return await findOneAndUpdateAndLean(updateQueryArgs)(this.accountModel);
  }

  async deleteOne(filter?: FilterQuery<account>): Promise<number> {
    const { deletedCount } = await this.accountModel.deleteOne(filter);
    return deletedCount;
  }
}
