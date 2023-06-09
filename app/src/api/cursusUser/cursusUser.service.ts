import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model, SortValues } from 'mongoose';
import { AggrNumericPerDate } from 'src/common/db/common.db.aggregation';
import type { QueryArgs } from 'src/common/db/common.db.query';
import type {
  UserPreview,
  UserRanking,
} from 'src/common/models/common.user.model';
import type { DateRangeArgs } from 'src/dateRange/dtos/dateRange.dto';
import type {
  IntPerCircle,
  UserCountPerLevel,
} from 'src/page/home/user/models/home.user.model';
import { StatDate } from 'src/statDate/StatDate';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { lookupQuestsUser } from '../questsUser/db/questsUser.database.aggregate';
import { lookupTitle } from '../title/db/title.database.aggregate';
import { lookupTitlesUser } from '../titlesUser/db/titlesUser.database.aggregate';
import { UserFullProfile } from './db/cursusUser.database.aggregate';
import {
  CursusUserDocument,
  User,
  cursus_user,
} from './db/cursusUser.database.schema';

export const FT_CURSUS_ID = 21;

// todo: quest 목록 적절한 곳 찾아주기
export const COMMON_CORE_QUEST_ID = 37;
export const INNER_QUEST_IDS = [
  COMMON_CORE_QUEST_ID,
  44,
  45,
  46,
  47,
  48,
  49,
] as const;

@Injectable()
export class CursusUserService {
  constructor(
    @InjectModel(cursus_user.name)
    private cursusUserModel: Model<cursus_user>,
  ) {}

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.cursusUserModel.aggregate<ReturnType>();
  }

  async findAll(
    queryArgs?: Partial<QueryArgs<cursus_user>>,
  ): Promise<CursusUserDocument[]> {
    const query = this.cursusUserModel.find(queryArgs?.filter ?? {});

    if (queryArgs?.sort) {
      query.sort(queryArgs.sort);
    }

    if (queryArgs?.limit) {
      query.limit(queryArgs.limit);
    }

    return await query;
  }

  async findOne(
    filter: FilterQuery<cursus_user> = {},
  ): Promise<CursusUserDocument> {
    const cursusUser = await this.cursusUserModel.findOne(filter);

    if (!cursusUser) {
      throw new NotFoundException();
    }

    return cursusUser;
  }

  async findOneByUserId(userId: number): Promise<CursusUserDocument> {
    return await this.findOne({ 'user.id': userId });
  }

  async findOneByLogin(login: string): Promise<CursusUserDocument> {
    return await this.findOne({ 'user.login': login });
  }

  async findUserPreviewByLogin(
    login: string,
    limit: number,
  ): Promise<UserPreview[]> {
    type Userable = Pick<User, 'id' | 'login' | 'image'>;

    const extractUserPreview = ({
      id,
      login,
      image,
    }: Userable): UserPreview => ({
      id,
      login,
      imgUrl: image?.link,
    });

    const result: Map<number, UserPreview> = new Map();

    const previewProjection = {
      'user.id': 1,
      'user.login': 1,
      'user.image': 1,
    };

    const prefixMatches: { user: Userable }[] = await this.cursusUserModel
      .find(
        {
          'user.login': { $regex: `^${login}`, $options: 'i' },
        },
        previewProjection,
      )
      .limit(limit);

    prefixMatches.forEach(({ user }) =>
      result.set(user.id, extractUserPreview(user)),
    );

    if (prefixMatches.length < limit) {
      const matches: { user: Userable }[] = await this.cursusUserModel
        .find(
          {
            'user.login': { $regex: login, $options: 'i' },
          },
          previewProjection,
        )
        .limit(limit - prefixMatches.length);

      matches.forEach(({ user }) =>
        result.set(user.id, extractUserPreview(user)),
      );
    }

    return [...result.values()];
  }

  async userFullProfile(userId: number): Promise<UserFullProfile> {
    const aggregate = this.cursusUserModel.aggregate<UserFullProfile>();

    const [cursusUserProfile] = await aggregate
      .match({ 'user.id': userId, 'cursus.id': FT_CURSUS_ID })
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

    if (!cursusUserProfile) {
      throw new NotFoundException();
    }

    return cursusUserProfile;
  }

  async userCount(filter?: FilterQuery<CursusUserDocument>): Promise<number> {
    if (!filter) {
      return await this.cursusUserModel.estimatedDocumentCount();
    }

    return await this.cursusUserModel.countDocuments(filter);
  }

  async userCountPerMonth(
    key: 'beginAt' | 'blackholedAt',
    dateRange: DateRangeArgs,
  ): Promise<AggrNumericPerDate[]> {
    const dateObject = StatDate.dateToBoundariesObject(dateRange);

    const aggregate = this.cursusUserModel.aggregate<AggrNumericPerDate>();

    return await aggregate
      .append({
        $bucket: {
          groupBy: {
            $dateToString: {
              date: `$${key}`,
              format: '%Y-%m-%dT%H:%M:%S.%LZ',
            },
          },
          boundaries: dateObject,
          default: 'defalut',
        },
      })
      .addFields({
        date: '$_id',
        value: '$count',
      })
      .project({
        _id: 0,
        count: 0,
      })
      .sort({
        date: 1,
      });
  }

  async userCountPerLevels(): Promise<UserCountPerLevel[]> {
    const aggregate = this.cursusUserModel.aggregate<UserCountPerLevel>();

    return await aggregate
      .addFields({ floorLevel: { $floor: '$level' } })
      .group({
        _id: '$floorLevel',
        userCount: { $count: {} },
      })
      .project({
        _id: 0,
        level: '$_id',
        userCount: '$userCount',
      })
      .sort({ level: 1 });
  }

  /**
   *
   * @example
   *
   * ```ts
   * userCountPerCircle(blackholedFilter);
   * userCountPerCircle(aliveFilter);
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

  async ranking(
    {
      filter,
      sort,
      limit,
    }: Omit<QueryArgs<cursus_user>, 'sort'> & {
      sort: Record<string, SortValues>;
    },
    valueExtractor: (doc: CursusUserDocument) => UserRanking['value'],
  ): Promise<UserRanking[]> {
    const rawRanking = await this.findAll({ filter, sort, limit });

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
