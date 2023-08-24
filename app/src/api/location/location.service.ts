import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import type { AggrNumericPerCluster } from 'src/database/mongoose/database.mongoose.aggregation';
import {
  QueryArgs,
  findAllAndLean,
} from 'src/database/mongoose/database.mongoose.query';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type { PreferredTime } from 'src/page/personal/general/models/personal.general.model';
import { locationDateRangeFilter } from './db/location.database.aggregate';
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
    private readonly locationModel: Model<location>,
  ) {}

  async findAllAndLean(queryArgs: QueryArgs<location>): Promise<location[]> {
    return await findAllAndLean(this.locationModel, queryArgs);
  }

  async preferredTime(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<PreferredTime> {
    const locations = await this.locationModel
      .find<{ beginAt: Date; endAt?: Date }>({
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
      total: Math.floor(total / DateWrapper.MIN),
      morning: Math.floor(morning / DateWrapper.MIN),
      daytime: Math.floor(daytime / DateWrapper.MIN),
      evening: Math.floor(evening / DateWrapper.MIN),
      night: Math.floor(night / DateWrapper.MIN),
    };
  }

  async preferredCluster(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<string | undefined> {
    const aggregate = this.locationModel.aggregate<AggrNumericPerCluster>();

    aggregate.match({ ...filter, 'user.id': userId });

    const [durationTimePerCluster] = await aggregate
      .group({
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
      })
      .sort({ value: -1 })
      .limit(1)
      .project({ _id: 0, cluster: '$_id', value: 1 });

    return durationTimePerCluster?.cluster ?? undefined;
  }

  async logtimeRanking(
    dateRange: DateRange,
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
        ...locationDateRangeFilter(dateRange),
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

    return userLogtimes
      .map((logtime) => ({
        userPreview: logtime.userPreview,
        value: sliceLogtime(logtime, dateRange),
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
  beginPoint.setHours(state * (24 / PartitionState.__STATE_COUNT__), 0, 0, 0);

  return beginPoint.getTime();
};

const toNextPartitionPoint = (partitionPoint: number): number =>
  partitionPoint + DateWrapper.HOUR * 6;

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
    newValue -= DateWrapper.dateGap(start, first.beginAt);
  }

  if (!last.endAt) {
    const now = new Date();

    newValue += DateWrapper.dateGap(now < end ? now : end, last.beginAt);
  }

  if (last.endAt && end < last.endAt) {
    newValue -= DateWrapper.dateGap(last.endAt, end);
  }

  return Math.floor(newValue / DateWrapper.MIN);
};
