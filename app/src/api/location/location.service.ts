import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AggrNumeric,
  AggrValuePerCluster,
} from 'src/common/db/common.db.aggregation';
import { PreferredTime } from 'src/page/personalGeneral/models/personal.general.model';
import { Time } from 'src/util';
import { location } from './db/location.database.schema';

@Injectable()
export class LocationService {
  // as const 는 mongoose 의 타입으로 인해 사용할 수 없습니다.
  clusterList = [
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
  ];

  constructor(
    @InjectModel(location.name)
    private locationModel: Model<location>,
  ) {}

  dateDiff(start: string, end: string) {
    return {
      $dateDiff: {
        startDate: {
          $max: [
            '$beginAt',
            {
              $dateFromString: {
                dateString: {
                  $dateToString: {
                    format: `%Y-%m-%dT${start}:00:00.000Z`,
                    date: '$nextday',
                  },
                },
              },
            },
          ],
        },
        endDate: {
          $min: [
            '$endAt',
            {
              $dateFromString: {
                dateString: {
                  $dateToString: {
                    format: `%Y-%m-%dT${end}:00:00.000Z`,
                    date: '$endAt',
                  },
                },
              },
            },
          ],
        },
        unit: 'millisecond',
        timezone: 'Asia/Seoul',
      },
    };
  }

  async getPreferredTime(
    uid: number,
    start: Date,
    end: Date,
  ): Promise<PreferredTime> {
    const aggregate = this.locationModel.aggregate<PreferredTime>();

    const to00 = this.dateDiff('21', '00');
    const to03 = this.dateDiff('00', '03');
    const to09 = this.dateDiff('03', '09');
    const to15 = this.dateDiff('09', '15');
    const to21 = this.dateDiff('15', '21');

    const [preferredTime] = await aggregate
      .match({
        'user.id': uid,
        beginAt: { $gte: start, $lt: end },
      })
      .addFields({
        beginAtFormatted: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$beginAt',
          },
        },
        endAtFormatted: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$endAt',
          },
        },
      })
      .addFields({
        nextday: {
          $cond: {
            if: {
              $ne: ['$beginAtFormatted', '$endAtFormatted'],
            },
            then: {
              $add: ['$beginAt', Time.DAY],
            },
            else: '$beginAt',
          },
        },
      })
      .append({
        $project: {
          '15to21': { $sum: { $cond: [{ $gte: [to21, 0] }, to21, 0] } },
          '21to00': { $sum: { $cond: [{ $gte: [to00, 0] }, to00, 0] } },
          '00to03': { $sum: { $cond: [{ $gte: [to03, 0] }, to03, 0] } },
          '03to09': { $sum: { $cond: [{ $gte: [to09, 0] }, to09, 0] } },
          '09to15': { $sum: { $cond: [{ $gte: [to15, 0] }, to15, 0] } },
        },
      })
      .group({
        _id: 0,
        '00to06': { $sum: '$15to21' },
        '06to09': { $sum: '$21to00' },
        '09to12': { $sum: '$00to03' },
        '12to18': { $sum: '$03to09' },
        '18to24': { $sum: '$09to15' },
      })
      .project({
        morning: { $floor: { $divide: ['$00to06', Time.HOUR] } },
        daytime: {
          $floor: {
            $divide: [{ $sum: { $add: ['$06to09', '$09to12'] } }, Time.HOUR],
          },
        },
        evening: { $floor: { $divide: ['$12to18', Time.HOUR] } },
        night: { $floor: { $divide: ['$18to24', Time.HOUR] } },
      });

    return preferredTime ?? { morning: 0, daytime: 0, evening: 0, night: 0 };
  }

  async getPreferredCluster(
    uid: number,
    start: Date,
    end: Date,
  ): Promise<string> {
    const aggregate = this.locationModel.aggregate<AggrValuePerCluster>();

    const [durationTimePerCluster] = await aggregate
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
          boundaries: this.clusterList,
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

    if (!durationTimePerCluster) {
      return 'null';
    }

    return durationTimePerCluster.cluster;
  }

  async getLogtime(uid: number, start: Date, end: Date): Promise<number> {
    const aggregate = this.locationModel.aggregate<AggrNumeric>();

    const [logtime] = await aggregate
      .match({ 'user.id': uid })
      .match({
        $and: [{ endAt: { $gt: start } }, { beginAt: { $lt: end } }],
      })
      .group({
        _id: 0,
        duration: {
          $push: {
            $cond: [
              { $lt: ['$beginAt', start] },
              { $subtract: ['$endAt', start] },
              {
                $cond: [
                  { $lt: [end, '$endAt'] },
                  { $subtract: [end, '$beginAt'] },
                  { $subtract: ['$endAt', '$beginAt'] },
                ],
              },
            ],
          },
        },
      })
      .addFields({
        value: { $floor: { $divide: [{ $sum: '$duration' }, Time.HOUR] } },
      })
      .project({
        _id: 0,
        duration: 0,
      });

    return logtime?.value ?? 0;
  }
}
