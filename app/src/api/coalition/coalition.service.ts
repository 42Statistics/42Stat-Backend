import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, Model } from 'mongoose';
import { API_CONFIG } from 'src/config/api';
import { CDN_CONFIG } from 'src/config/cdn';
import type { Coalition } from '../../page/common/models/coalition.model';
import { coalition } from './db/coalition.database.schema';

@Injectable()
export class CoalitionService {
  constructor(
    @InjectModel(coalition.name)
    private readonly coalitionModel: Model<coalition>,
    @Inject(API_CONFIG.KEY)
    private readonly apiConfig: ConfigType<typeof API_CONFIG>,
    @Inject(CDN_CONFIG.KEY)
    private readonly cdnConfig: ConfigType<typeof CDN_CONFIG>,
  ) {}

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.coalitionModel.aggregate<ReturnType>();
  }

  daoToDto(dao: coalition): Coalition {
    return {
      ...dao,
      coverUrl: this.coverUrlById(dao.id),
      // todo: deprecated at v0.9.0
      imageUrl: this.imageUrlById(dao.id),
      imgUrl: this.imageUrlById(dao.id),
      color: dao.color ?? '#161616',
    };
  }

  private coverUrlById(id: number): string {
    if (this.isSeoulCoalitionId(id)) {
      return `${this.cdnConfig.COALITION}/${id}/cover.webp`;
    }

    return `${this.cdnConfig.COALITION}/fallback/cover.webp`;
  }

  private imageUrlById(id: number): string {
    if (this.isSeoulCoalitionId(id)) {
      return `${this.cdnConfig.COALITION}/${id}/logo.svg`;
    }

    return `${this.cdnConfig.COALITION}/fallback/logo.svg`;
  }

  private isSeoulCoalitionId(id: number): boolean {
    return (
      this.apiConfig.SEOUL_COALITION_ID.find((seoulId) => seoulId === id) !==
      undefined
    );
  }

  getSeoulCoalitionIds(): readonly number[] {
    return this.apiConfig.SEOUL_COALITION_ID;
  }
}
