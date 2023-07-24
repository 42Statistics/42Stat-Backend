import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, Model } from 'mongoose';
import { findAll, type QueryArgs } from 'src/common/db/common.db.query';
import { coalition } from './db/coalition.database.schema';
import { API_CONFIG, ApiConfig } from 'src/config/api';

@Injectable()
export class CoalitionService {
  private readonly seoulCoalitionIds: number[];

  constructor(
    @InjectModel(coalition.name)
    private readonly coalitionModel: Model<coalition>,
    private readonly configService: ConfigService,
  ) {
    this.seoulCoalitionIds =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).SEOUL_COALITION_ID;
  }

  async findAll(queryArgs?: QueryArgs<coalition>): Promise<coalition[]> {
    return await findAll(queryArgs)(this.coalitionModel);
  }

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.coalitionModel.aggregate<ReturnType>();
  }

  getSeoulCoalitionIds(): readonly number[] {
    return this.seoulCoalitionIds;
  }
}
