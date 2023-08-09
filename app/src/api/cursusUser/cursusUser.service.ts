import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model, SortValues } from 'mongoose';
import {
  findByDateFromAggrDateBucket,
  type AggrNumericPerDateBucket,
} from 'src/common/db/common.db.aggregation';
import {
  findAllAndLean,
  findOneAndLean,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import type { IntRecord } from 'src/common/models/common.valueRecord.model';
import type { UserFullProfile } from 'src/common/userFullProfile';
import type { DateRange } from 'src/dateRange/dtos/dateRange.dto';
import type {
  IntPerCircle,
  UserCountPerLevel,
} from 'src/page/home/user/models/home.user.model';
import { DateWrapper } from 'src/statDate/StatDate';
import { CoalitionService } from '../coalition/coalition.service';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
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

  // todo: deprecated at v0.6.0
  async findUserPreviewByLogin(
    login: string,
    limit: number,
  ): Promise<UserPreview[]> {
    const result: Map<number, UserPreview> = new Map();

    const previewProjection = {
      'user.id': 1,
      'user.login': 1,
      'user.image': 1,
    };

    const escapedLogin = login.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');

    const prefixMatches: {
      user: Omit<UserPreview, 'imgUrl'> & { image: { link?: string } };
    }[] = await this.findAllAndLean({
      filter: { 'user.login': new RegExp(`^${escapedLogin}`, 'i') },
      select: previewProjection,
      limit,
    });

    prefixMatches.forEach(({ user }) =>
      result.set(user.id, {
        id: user.id,
        login: user.login,
        imgUrl: user.image.link,
      }),
    );

    if (prefixMatches.length < limit) {
      const matches: {
        user: Omit<UserPreview, 'imgUrl'> & { image: { link?: string } };
      }[] = await this.findAllAndLean({
        filter: { 'user.login': new RegExp(`.${escapedLogin}`, 'i') },
        select: previewProjection,
        limit: limit - result.size,
      });

      matches.forEach(({ user }) =>
        result.set(user.id, {
          id: user.id,
          login: user.login,
          imgUrl: user.image.link,
        }),
      );
    }

    return [...result.values()];
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
      .project({
        cursusUser: 1,
        coalition: { $first: '$coalitions_users.coalitions' },
        titlesUsers: '$titles_users',
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
    const dates = DateWrapper.partitionByMonth(dateRange);
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
      limit,
    }: Omit<QueryArgs<cursus_user>, 'sort'> & {
      sort: Record<string, SortValues>;
    },
    valueExtractor: (cursusUser: cursus_user) => UserRank['value'],
  ): Promise<UserRank[]> {
    const rawRanking = await this.findAllAndLean({ filter, sort, limit });

    return rawRanking.map((rawRank, index) => ({
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
