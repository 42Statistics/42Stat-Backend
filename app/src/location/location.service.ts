import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AggrValuePerDate } from 'src/common/db/common.db.aggregation';
import { PreferredTime } from 'src/personalGeneral/models/personal.general.model';
import { Time } from 'src/util';
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
    const aggregate = this.locationModel.aggregate<AggrValuePerDate>();

    const dateObject = Time.dateToBoundariesObject(start, end);

    const durationTimeWithDate = await aggregate
      .match({ 'user.id': uid })
      .append({
        $bucket: {
          groupBy: {
            $dateToString: {
              date: '$endAt',
              format: '%Y-%m-%dT%H:%M:%S.%LZ',
            },
          },
          boundaries: dateObject,
          default: 'defalut',
          output: {
            duration: { $push: { $subtract: ['$endAt', '$beginAt'] } },
          },
        },
      })
      .project({ value: { $sum: '$duration' } })
      .addFields({
        value: { $floor: { $divide: ['$value', 1000 * 3600] } },
        date: '$_id',
      });

    return Time.getCountByDate(start, durationTimeWithDate);
  }
}