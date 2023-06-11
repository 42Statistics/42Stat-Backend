import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type {
  AggrNumeric,
  AggrNumericPerCluster,
} from 'src/common/db/common.db.aggregation';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import type { PreferredTime } from 'src/page/personal/general/models/personal.general.model';
import { StatDate } from 'src/statDate/StatDate';
import { location } from './db/location.database.schema';

const enum PartitionState {
  NIGHT,
  MORNING,
  DAYTIME,
  EVENING,
  __STATE_COUNT__,
}

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(location.name)
    private locationModel: Model<location>,
  ) {}

  async preferredTime(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<PreferredTime> {
    const locations = await this.locationModel
      .find<{ beginAt: Date; endAt: Date }>({
        'user.id': userId,
        ...filter,
      })
      .select({ beginAt: 1, endAt: 1 });

    // 이제부터 날짜를 전부 millisecond 로 사용합니다
    const { total, morning, daytime, evening, night } = locations.reduce(
      (acc, { beginAt, endAt }) => {
        const end = (endAt ?? new Date()).getTime();

        let state = initPartitionStateByHour(beginAt);
        let partitionPoint = initPartitionPoint(beginAt, state);

        for (let curr = beginAt.getTime(); curr < end; curr = partitionPoint) {
          partitionPoint = toNextPartitionPoint(partitionPoint);

          const amount = Math.min(end, partitionPoint) - curr;

          switch (state) {
            case PartitionState.NIGHT:
              acc.night += amount;
              break;
            case PartitionState.MORNING:
              acc.morning += amount;
              break;
            case PartitionState.DAYTIME:
              acc.daytime += amount;
              break;
            case PartitionState.EVENING:
              acc.evening += amount;
              break;
            default:
              throw new InternalServerErrorException();
          }

          acc.total += amount;

          state = toNextPartitionState(state);
        }

        return acc;
      },
      {
        total: 0,
        morning: 0,
        daytime: 0,
        evening: 0,
        night: 0,
      },
    );

    return {
      total: Math.floor(total / 1000 / 60),
      morning: Math.floor(morning / 1000 / 60),
      daytime: Math.floor(daytime / 1000 / 60),
      evening: Math.floor(evening / 1000 / 60),
      night: Math.floor(night / 1000 / 60),
    };
  }

  async preferredCluster(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<string | null> {
    const aggregate = this.locationModel.aggregate<AggrNumericPerCluster>();

    aggregate.match({ 'user.id': userId });

    if (filter) {
      aggregate.match(filter);
    }

    const [durationTimePerCluster] = await aggregate.group({
      _id: {
        $substrCP: ['$host', 0, { $indexOfCP: ['$host', 'r'] }],
      },
      value: {
        $sum: {
          $dateDiff: {
            startDate: '$beginAt',
            endDate: '$endAt',
            unit: 'millisecond',
          },
        },
      },
    });

    return durationTimePerCluster?.cluster ?? null;
  }

  async logtimeByDateRange(
    { start, end }: DateRange,
    filter?: FilterQuery<location>,
  ): Promise<number> {
    const aggregate = this.locationModel.aggregate<
      AggrNumeric & {
        first: location;
        last: location;
      }
    >();

    const [logtime] = await aggregate
      .match({
        ...filter,
        $and: [{ endAt: { $gt: start } }, { beginAt: { $lt: end } }],
      })
      .sort({ beginAt: 1 })
      .group({
        _id: 'result',
        value: {
          $sum: {
            $dateDiff: {
              startDate: '$beginAt',
              endDate: '$endAt',
              unit: 'millisecond',
            },
          },
        },
        first: { $first: '$$ROOT' },
        last: { $last: '$$ROOT' },
      });

    if (!logtime) {
      return 0;
    }

    if (logtime.first.beginAt < start) {
      logtime.value -= StatDate.dateGap(start, logtime.first.beginAt);
    }

    if (!logtime.last.endAt) {
      logtime.value += StatDate.dateGap(end, logtime.last.beginAt);
    }

    if (logtime.last.endAt && end < logtime.last.endAt) {
      logtime.value -= StatDate.dateGap(logtime.last.endAt, end);
    }

    return Math.floor(logtime.value / StatDate.MIN);
  }
}

const initPartitionStateByHour = (date: Date): PartitionState => {
  const currHour = date.getHours();

  if (currHour < 6) {
    return PartitionState.NIGHT;
  }

  if (currHour < 12) {
    return PartitionState.MORNING;
  }

  if (currHour < 18) {
    return PartitionState.DAYTIME;
  }

  return PartitionState.EVENING;
};

const toNextPartitionState = (state: PartitionState): PartitionState =>
  ((state + 1) % PartitionState.__STATE_COUNT__) as PartitionState;

const initPartitionPoint = (date: Date, state: PartitionState) => {
  const beginPoint = new Date(date);
  beginPoint.setHours(state * 6, 0, 0, 0);

  return beginPoint.getTime();
};

const toNextPartitionPoint = (partitionPoint: number): number =>
  partitionPoint + 1000 * 3600 * 6;
