import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import {
  findAllAndLean,
  type QueryArgs,
} from 'src/database/mongoose/database.mongoose.query';
import { promo } from './db/promo.database.schema';

@Injectable()
export class PromoService {
  constructor(
    @InjectModel(promo.name)
    private readonly promoModel: Model<promo>,
  ) {}

  async findAllAndLean(queryArgs?: QueryArgs<promo>): Promise<promo[]> {
    return await findAllAndLean(this.promoModel, queryArgs);
  }

  @CacheOnReturn()
  async promoList(): Promise<promo[]> {
    return await this.findAllAndLean();
  }
}
