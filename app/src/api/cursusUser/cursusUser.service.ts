import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model, SortValues } from 'mongoose';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import type { UserFullProfile } from 'src/common/userFullProfile';
import {
  findByDateFromAggrDateBucket,
  type AggrNumericPerDateBucket,
} from 'src/database/mongoose/database.mongoose.aggregation';
import {
  findAllAndLean,
  findOneAndLean,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/database/mongoose/database.mongoose.query';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import type {
  IntPerCircle,
  UserCountPerLevel,
} from 'src/page/home/user/models/home.user.model';
import { CampusUserService } from '../capmusUser/campusUser.service';
import { CoalitionService } from '../coalition/coalition.service';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { lookupPromosUsers } from '../promosUser/db/promosUser.database.aggregate';
import { lookupQuestsUser } from '../questsUser/db/questsUser.database.aggregate';
import {
  COMMON_CORE_QUEST_ID,
  INNER_QUEST_IDS,
} from '../questsUser/questsUser.service';
import { lookupTitle } from '../title/db/title.database.aggregate';
import { lookupTitlesUser } from '../titlesUser/db/titlesUser.database.aggregate';
import type { UserFullProfileAggr } from './db/cursusUser.database.aggregate';
import { aliveUserFilter } from './db/cursusUser.database.query';
import { cursus_user } from './db/cursusUser.database.schema';

const isLearner = (
  cursusUser: cursus_user,
): cursusUser is Omit<cursus_user, 'blackholedAt'> & { blackholedAt: Date } =>
  cursusUser.grade === 'Learner';

// todo: 적절한 위치 찾기
export const isBlackholed = (
  cursusUser: cursus_user,
  dateRange?: DateRange,
): boolean => {
  if (!isLearner(cursusUser)) {
    return false;
  }

  const blackholedAt = cursusUser.blackholedAt;
  const now = new Date();

  if (dateRange) {
    return (
      dateRange.start <= blackholedAt &&
      blackholedAt < (dateRange.end < now ? dateRange.end : now)
    );
  }

  return blackholedAt < now;
};

@Injectable()
export class CursusUserService {
  constructor(
    @InjectModel(cursus_user.name)
    private readonly cursusUserModel: Model<cursus_user>,
    private readonly coalitionService: CoalitionService,
    private readonly campusUserService: CampusUserService,
  ) {}

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.cursusUserModel.aggregate<ReturnType>();
  }

  async findAllAndLean(
    queryArgs?: QueryArgs<cursus_user>,
  ): Promise<cursus_user[]> {
    return await findAllAndLean(this.cursusUserModel, queryArgs);
  }

  async findOneAndLean(
    queryOneArgs: QueryOneArgs<cursus_user>,
  ): Promise<cursus_user | null> {
    return await findOneAndLean(this.cursusUserModel, queryOneArgs);
  }

  async findAllUserPreviewAndLean(
    queryArgs?: Omit<QueryArgs<cursus_user>, 'select'>,
  ): Promise<UserPreview[]> {
    const cursusUsers: {
      user: {
        id: number;
        login: string;
        image: {
          link?: string;
        };
      };
    }[] = await this.findAllAndLean({
      ...queryArgs,
      select: {
        'user.id': 1,
        'user.login': 1,
        'user.image.link': 1,
      },
    });

    return cursusUsers.map(({ user }) => ({
      id: user.id,
      login: user.login,
      imgUrl: user.image.link,
    }));
  }

  async userFullProfile(
    filter?: FilterQuery<cursus_user>,
  ): Promise<UserFullProfile[]> {
    const aggregate = this.cursusUserModel.aggregate<UserFullProfileAggr>();

    if (filter) {
      aggregate.match(filter);
    }

    const userFullProfileAggr = await aggregate
      .addFields({
        cursusUser: '$$ROOT',
      })
      .append(
        lookupCoalitionsUser('user.id', 'userId', [
          lookupCoalition('coalitionId', 'id'),
          { $addFields: { coalitions: { $first: '$coalitions' } } },
        ]),
      )
      .append(
        lookupTitlesUser('user.id', 'userId', [
          lookupTitle('titleId', 'id'),
          { $addFields: { titles: { $first: '$titles' } } },
        ]),
      )
      .append(lookupPromosUsers('user.id', 'userId'))
      .project({
        cursusUser: 1,
        coalition: { $first: '$coalitions_users.coalitions' },
        titlesUsers: '$titles_users',
        promo: { $first: '$promos_users.promo' },
      });

    return userFullProfileAggr.map((userFullProfile) => {
      return this.toUserFullProfileDto(userFullProfile);
    });
  }

  private toUserFullProfileDto(dao: UserFullProfileAggr): UserFullProfile {
    return {
      ...dao,
      coalition: dao.coalition
        ? this.coalitionService.daoToDto(dao.coalition)
        : undefined,
    };
  }

  async findOneUserFullProfilebyUserId(
    userId: number,
  ): Promise<UserFullProfile | null> {
    const userFullProfile = await this.userFullProfile({
      'user.id': userId,
    }).then((result) => result.at(0));

    return userFullProfile ?? null;
  }

  async userCount(filter?: FilterQuery<cursus_user>): Promise<number> {
    if (!filter) {
      return await this.cursusUserModel.estimatedDocumentCount();
    }

    return await this.cursusUserModel.countDocuments(filter);
  }

  async aliveUserCountRecords(dateRange: DateRange): Promise<IntRecord[]> {
    const dates = partitionByMonthForAliveUserCountRecords(dateRange);

    const aggregate = this.cursusUserModel.aggregate<{
      begins: AggrNumericPerDateBucket[];
      blackholeds: AggrNumericPerDateBucket[];
    }>();

    const bucketUserCountRecordsByKey = (key: string) => [
      {
        $bucket: {
          groupBy: `$${key}`,
          boundaries: dates,
          default: 'default',
        },
      },
      {
        $addFields: {
          at: '$_id',
          value: '$count',
        },
      },
      {
        $project: {
          _id: 0,
          count: 0,
        },
      },
    ];

    const [{ begins, blackholeds }] = await aggregate.facet({
      begins: bucketUserCountRecordsByKey('beginAt'),
      blackholeds: bucketUserCountRecordsByKey('blackholedAt'),
    });

    const calculateChangedCount = (
      begins: AggrNumericPerDateBucket[],
      blackholeds: AggrNumericPerDateBucket[],
      date: Date,
    ) => {
      return (
        (findByDateFromAggrDateBucket(begins, date)?.value ?? 0) -
        (findByDateFromAggrDateBucket(blackholeds, date)?.value ?? 0)
      );
    };

    const initialAliveCount = calculateChangedCount(
      begins,
      blackholeds,
      dates[0],
    );

    return dates.slice(1, -1).reduce(
      ([accRecords, accAliveCount], date) => {
        const changedCount = calculateChangedCount(begins, blackholeds, date);
        const currAliveCount = accAliveCount + changedCount;

        accRecords.push({
          at: date,
          value: currAliveCount,
        });

        return [accRecords, currAliveCount] as const;
      },
      [[], initialAliveCount] as readonly [IntRecord[], number],
    )[0];
  }

  async userCountPerLevels(): Promise<UserCountPerLevel[]> {
    const aggregate = this.cursusUserModel.aggregate<UserCountPerLevel>();

    return await aggregate
      .match(aliveUserFilter)
      .addFields({ floorLevel: { $floor: '$level' } })
      .group({
        _id: '$floorLevel',
        value: { $count: {} },
      })
      .project({
        _id: 0,
        level: '$_id',
        value: '$value',
      })
      .sort({ level: 1 });
  }

  /**
   *
   * @example
   *
   * ```ts
   * userCountPerCircle(blackholedUserFilter());
   * userCountPerCircle(aliveUserFilter);
   * ```
   */
  async userCountPerCircle(
    filter?: FilterQuery<cursus_user>,
  ): Promise<IntPerCircle[]> {
    const aggregate = this.cursusUserModel.aggregate<{
      _id: number | null;
      value: number;
    }>();

    if (filter) {
      aggregate.match(filter);
    }

    const countPerCircle = await aggregate
      .append(
        lookupQuestsUser('user.id', 'user.id', [
          {
            $match: {
              'quest.id': { $in: INNER_QUEST_IDS },
              validatedAt: { $ne: null },
            },
          },
          {
            $sort: { validatedAt: -1 },
          },
        ]),
      )
      .group({
        _id: { $first: '$quests_users.quest.id' },
        value: { $count: {} },
      })
      .sort({ _id: 1 });

    const commonCoreIndex = countPerCircle.findIndex(
      ({ _id }) => _id === COMMON_CORE_QUEST_ID,
    );

    if (commonCoreIndex !== -1) {
      countPerCircle.push(...countPerCircle.splice(commonCoreIndex, 1));
    }

    return countPerCircle.map(({ value }, index) => ({
      circle: index,
      value,
    }));
  }

  //todo: ranking field 외부에서 받도록 변경
  async ranking(
    {
      filter,
      sort,
    }: Omit<QueryArgs<cursus_user>, 'sort' | 'select' | 'limit'> & {
      sort: Record<string, SortValues>;
    },
    valueExtractor: (cursusUser: cursus_user) => UserRank['value'],
  ): Promise<UserRank[]> {
    const rawRanking = await this.findAllAndLean({
      filter,
      sort,
    });

    const transferOutUserIdList =
      await this.campusUserService.getAllTransferOutUserId();

    return rawRanking
      .filter((rawRank) => !transferOutUserIdList.includes(rawRank.user.id))
      .map((rawRank, index) => ({
        userPreview: {
          id: rawRank.user.id,
          login: rawRank.user.login,
          imgUrl: rawRank.user.image.link,
        },
        value: valueExtractor(rawRank),
        rank: index + 1,
      }));
  }
}

// todo: 그냥 이거 안쓰는게 제일 좋음
/**
 *
 * @description
 * @see CursusUserService.aliveUserCountRecords
 * aliveUserCountRecords 에서만 사용해야 합니다.
 *
 * 주어진 dateRange 사이 범위를 월 단위로 Date 객체를 채워서 반환하는 함수 입니다.
 *
 * start, end 를 제외하고, 무조건 n 월 1 일으로 채우기 때문에, end 가 1 일 00:00:00.000 인
 * 경우 bucket aggregation 이 오류를 발생시킵니다. 때문에 1ms 를 더하여 실제 의도보다 1ms 이후를
 * 같이 계산하도록 합니다.
 *
 * end 값을 어떻게 활용하고 싶냐에 따라서 로직이 수정되어야 하기 때문에, (ex. 현재 날짜와 상관없이
 * 계산하고 싶을 경우) 여러 로직에서 범용으로 사용해선 안됩니다.
 *
 * @example
 * start: 02-10, end: 04-20
 * return: [ 1970-01-01, 02-10, 03-01, 04-01, 04-20]
 *
 * start: 02-10, end: 04-01
 * return: [ 1970-01-01, 02-10, 03-01, 04-01, (04-01 + 1ms)]
 */
const partitionByMonthForAliveUserCountRecords = ({
  start,
  end,
}: DateRange): Date[] => {
  const partitioned = [new Date(0), new Date(start)];

  for (
    let currDate = new DateWrapper(start).startOfMonth().moveMonth(1);
    currDate.toDate() < end;
    currDate = currDate.moveMonth(1)
  ) {
    partitioned.push(currDate.toDate());
  }

  if (
    end.getTime() !== new DateWrapper(end).startOfMonth().toDate().getTime()
  ) {
    partitioned.push(new Date(end.getTime() + 1));
  } else {
    partitioned.push(new Date(end));
  }

  return partitioned;
};
