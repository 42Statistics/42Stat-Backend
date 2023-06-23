import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumericPerCluster } from 'src/common/db/common.db.aggregation';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
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
      total: Math.floor(total / StatDate.MIN),
      morning: Math.floor(morning / StatDate.MIN),
      daytime: Math.floor(daytime / StatDate.MIN),
      evening: Math.floor(evening / StatDate.MIN),
      night: Math.floor(night / StatDate.MIN),
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
  ): Promise<UserRank[]> {
    const aggregate = this.locationModel.aggregate<{
      userPreview: UserPreview;
      value: number;
      first: location;
      last: location;
    }>();

    const userLogtimes = await aggregate
      .match({
        ...filter,
        $and: [{ endAt: { $gte: start } }, { beginAt: { $lt: end } }],
      })
      .sort({ beginAt: 1 })
      .group({
        _id: '$user.id',
        login: { $first: '$user.login' },
        imgUrl: { $first: '$user.image.link' },
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
      })
      .project({
        _id: 0,
        userId: '$_id',
        userPreview: {
          id: '$_id',
          login: '$login',
          imgUrl: '$imgUrl',
        },
        value: 1,
        first: 1,
        last: 1,
      });

    userLogtimes.forEach((logtime) => sliceLogtime(logtime, { start, end }));

    return userLogtimes
      .map((logtime) => ({
        userPreview: logtime.userPreview,
        value: sliceLogtime(logtime, { start, end }),
      }))
      .sort((a, b) => b.value - a.value)
      .map((curr, index) => ({
        ...curr,
        rank: index + 1,
      }));
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

const sliceLogtime = (
  {
    value,
    first,
    last,
  }: {
    value: number;
    first: location;
    last: location;
  },
  { start, end }: DateRange,
): number => {
  let newValue = value;

  if (first.beginAt < start) {
    newValue -= StatDate.dateGap(start, first.beginAt);
  }

  if (!last.endAt) {
    newValue += StatDate.dateGap(end, last.beginAt);
  }

  if (last.endAt && end < last.endAt) {
    newValue -= StatDate.dateGap(last.endAt, end);
  }

  return Math.floor(newValue / StatDate.MIN);
};
