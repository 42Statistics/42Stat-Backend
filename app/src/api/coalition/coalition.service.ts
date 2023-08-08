import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, Model } from 'mongoose';
import { coalition } from './db/coalition.database.schema';
import { CDN_CONFIG, type CdnConfig } from 'src/config/cdn';
import { API_CONFIG, ApiConfig } from 'src/config/api';
import type { Coalition } from './models/coalition.model';

@Injectable()
export class CoalitionService {
  private readonly coalitionCdn: string;
  private readonly seoulCoalitionIds: number[];

  constructor(
    @InjectModel(coalition.name)
    private readonly coalitionModel: Model<coalition>,
    private readonly configService: ConfigService,
  ) {
    this.coalitionCdn =
      this.configService.getOrThrow<CdnConfig>(CDN_CONFIG).COALITION;

    this.seoulCoalitionIds =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).SEOUL_COALITION_ID;
  }

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.coalitionModel.aggregate<ReturnType>();
  }

  daoToDto(dao: coalition): Coalition {
    return {
      ...dao,
      coverUrl: this.coverUrlById(dao.id),
      imageUrl: this.imageUrlById(dao.id),
      color: dao.color ?? '#161616',
    };
  }

  private coverUrlById(id: number): string {
    if (this.isSeoulCoalitionId(id)) {
      return `${this.coalitionCdn}/${id}/cover.webp`;
    }

    return `${this.coalitionCdn}/fallback/cover.webp`;
  }

  private imageUrlById(id: number): string {
    if (this.isSeoulCoalitionId(id)) {
      return `${this.coalitionCdn}/${id}/logo.svg`;
    }

    return `${this.coalitionCdn}/fallback/logo.svg`;
  }

  private isSeoulCoalitionId(id: number): boolean {
    return (
      this.seoulCoalitionIds.find((seoulId) => seoulId === id) !== undefined
    );
  }

  getSeoulCoalitionIds(): readonly number[] {
    return this.seoulCoalitionIds;
  }
}
