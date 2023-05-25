import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreferredTime } from 'src/personalGeneral/models/personal.general.model';
import { location } from './db/location.database.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(location.name)
    private locationModel: Model<location>,
  ) {}

  async getPreferredTime(
    uid: number,
    start: Date,
    end: Date,
  ): Promise<PreferredTime> {
    const aggregate = this.locationModel.aggregate<PreferredTime>();

    return {
      morning: 123,
      daytime: 123,
      evening: 123,
      night: 123,
    };
  }

  async getPreferredCluster(
    uid: number,
    start: Date,
    end: Date,
  ): Promise<string> {
    const aggregate = this.locationModel.aggregate<string>();
    return 'c1';
  }

  async getLogtime(uid: number, start: Date, end: Date): Promise<number> {
    const aggregate = this.locationModel.aggregate<number>();
    return 10;
  }
}
