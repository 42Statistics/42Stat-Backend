import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
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
    const newToken = await new this.tokenModel({
      userId,
      accessToken,
      refreshToken,
    }).save();

    return newToken.toObject();
  }

  async findOneAndUpdate(
    filter: FilterQuery<token>,
    update: UpdateQuery<token>,
    options?: QueryOptions<token>,
  ): Promise<token | null> {
    return await this.tokenModel
      .findOneAndUpdate(filter, update, options)
      .lean();
  }

  async deleteOne(filter?: FilterQuery<token>): Promise<number> {
    const { deletedCount } = await this.tokenModel.deleteOne(filter);

    return deletedCount;
  }

  async deleteMany(filter?: FilterQuery<token>): Promise<number> {
    const { deletedCount } = await this.tokenModel.deleteMany(filter);

    return deletedCount;
  }
}
