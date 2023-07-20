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
    private tokenModel: Model<token>,
  ) {}

  async create(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<token> {
    const newToken = new this.tokenModel({
      userId,
      accessToken,
      refreshToken,
    });
    return await this.tokenModel.create(newToken);
  }

  async findOne(filter?: FilterQuery<token>): Promise<token | null> {
    return await this.tokenModel.findOne(filter).lean();
  }

  async findOneAndUpdate(
    filter: FilterQuery<token>,
    update: UpdateQuery<token>,
    options?: QueryOptions<token>,
  ): Promise<token | null> {
    return await this.tokenModel.findOneAndUpdate(filter, update, options);
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
