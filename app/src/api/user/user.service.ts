import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { user } from './db/user.database.schema';
import type { Model } from 'mongoose';
import {
  findOneAndLean,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(user.name)
    private readonly userModel: Model<user>,
  ) {}

  async findOneAndLean(
    queryOneArgs?: QueryOneArgs<user>,
  ): Promise<user | null> {
    return await findOneAndLean(this.userModel, queryOneArgs);
  }

  async findUserIdByLoginAndLean(
    login: string,
  ): Promise<Pick<user, 'id'> | null> {
    return await this.findOneAndLean({
      filter: { login: login },
      select: { id: 1 },
    });
  }
}
