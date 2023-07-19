import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { account } from 'src/api/account/db/account.database.schema';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(account.name)
    private accountModel: Model<account>,
  ) {}

  async findOne(filter?: FilterQuery<account>): Promise<account> {
    const account = await this.accountModel.findOne(filter).lean();

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  async findOneAndUpdate(
    filter: FilterQuery<account>,
    update: UpdateQuery<account>,
    options?: QueryOptions<account>,
  ): Promise<account> {
    const account = await this.accountModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    if (!account) {
      //todo: 500반환 안하고 생성하는지 확인. 사용하는 쿼리 테스트해보기
      throw new InternalServerErrorException();
    }

    return account;
  }

  async deleteOne(filter?: FilterQuery<account>): Promise<number> {
    const { deletedCount } = await this.accountModel.deleteOne(filter);
    return deletedCount;
  }
}
