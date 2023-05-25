import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AggrValuePerCluster,
  AggrValuePerDate,
} from 'src/common/db/common.db.aggregation';
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
    const aggregate = this.locationModel.aggregate<AggrValuePerCluster>();

    const durationTimePerCluster = await aggregate
      .match({ 'user.id': uid })
      .match({
        beginAt: { $gte: start },
        endAt: { $lt: end },
      })
      .project({
        _id: 0,
        beginAt: 1,
        endAt: 1,
        host: 1,
        substring: { $substr: ['$host', 0, { $indexOfCP: ['$host', 'r'] }] },
      })
      .append({
        $bucket: {
          groupBy: '$substring',
          boundaries: [
            'c1',
            'c10',
            'c2',
            'c3',
            'c4',
            'c5',
            'c6',
            'c7',
            'c8',
            'c9',
            'cx1',
            'cx2',
            'cx3',
          ],
          default: 'defalut',
          output: {
            duration: {
              $sum: {
                $dateDiff: {
                  startDate: '$beginAt',
                  endDate: '$endAt',
                  unit: 'hour',
                },
              },
            },
          },
        },
      })
      .project({ value: { $sum: '$duration' } })
      .addFields({ value: '$value', cluster: '$_id' })
      .project({ _id: 0 })
      .sort({ value: -1 });

    return durationTimePerCluster[0].cluster;
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
              date: '$endAt', //todo: beginAt검사 후 넘어가는 시간에 2번 계산하기 필요
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
