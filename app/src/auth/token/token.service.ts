import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import {
  UpdateQueryArgs,
  findOneAndUpdateAndLean,
} from 'src/common/db/common.db.query';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { token } from './db/token.database.schema';

@UseFilters(HttpExceptionFilter)
@Injectable()
export class TokenService {
  constructor(
    @InjectModel(token.name)
    private readonly tokenModel: Model<token>,
  ) {}

  async create(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<token> {
    return await this.tokenModel
      .create({
        userId,
        accessToken,
        refreshToken,
      })
      .then((result) => result.toObject());
  }

  async findOneAndUpdateAndLean(
    updateQueryArgs: UpdateQueryArgs<token>,
  ): Promise<token | null> {
    return await findOneAndUpdateAndLean(this.tokenModel, updateQueryArgs);
  }

  async deleteOne(filter?: FilterQuery<token>): Promise<number> {
    return await this.tokenModel
      .deleteOne(filter)
      .then((result) => result.deletedCount);
  }

  async deleteMany(filter?: FilterQuery<token>): Promise<number> {
    return await this.tokenModel
      .deleteMany(filter)
      .then((result) => result.deletedCount);
  }
}
