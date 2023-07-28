import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model, SortValues } from 'mongoose';
import type { AggrNumericPerDateBucket } from 'src/common/db/common.db.aggregation';
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
import type { DateRangeArgs } from 'src/dateRange/dtos/dateRange.dto';
import type {
  IntPerCircle,
  UserCountPerLevel,
} from 'src/page/home/user/models/home.user.model';
import { DateWrapper } from 'src/statDate/StatDate';
import { CoalitionService } from '../coalition/coalition.service';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import type { Coalition } from '../coalition/models/coalition.model';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { lookupQuestsUser } from '../questsUser/db/questsUser.database.aggregate';
import {
  COMMON_CORE_QUEST_ID,
  INNER_QUEST_IDS,
} from '../questsUser/questsUser.service';
import { lookupTitle } from '../title/db/title.database.aggregate';
import type { title } from '../title/db/title.database.schema';
import { lookupTitlesUser } from '../titlesUser/db/titlesUser.database.aggregate';
import type { titles_user } from '../titlesUser/db/titlesUser.database.schema';
import type { UserFullProfileAggr } from './db/cursusUser.database.aggregate';
import {
  aliveUserFilter,
  blackholedUserFilterByDateRange,
} from './db/cursusUser.database.query';
import { cursus_user } from './db/cursusUser.database.schema';

export type UserFullProfile = {
  cursusUser: cursus_user;
  coalition?: Coalition;
  titlesUsers: (titles_user & {
    titles: title;
  })[];
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
    return await findAllAndLean(queryArgs)(this.cursusUserModel);
  }

  async findOneAndLean(
    queryOneArgs: QueryOneArgs<cursus_user>,
  ): Promise<cursus_user | null> {
    return await findOneAndLean(queryOneArgs)(this.cursusUserModel);
  }

  async findOneAndLeanByUserId(userId: number): Promise<cursus_user | null> {
    return await this.findOneAndLean({ filter: { 'user.id': userId } });
  }

  async findOneAndLeanByLogin(login: string): Promise<cursus_user | null> {
    return await this.findOneAndLean({ filter: { 'user.login': login } });
  }

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

  async userCountPerMonth(
    key: 'beginAt' | 'blackholedAt',
    dateRange: DateRangeArgs,
  ): Promise<AggrNumericPerDateBucket[]> {
    const dates = DateWrapper.partitionByMonth(dateRange);

    const aggregate =
      this.cursusUserModel.aggregate<AggrNumericPerDateBucket>();

    if (key === 'blackholedAt') {
      aggregate.match(blackholedUserFilterByDateRange());
    }

    return await aggregate
      .append({
        $bucket: {
          groupBy: `$${key}`,
          boundaries: dates,
          default: 'default',
        },
      })
      .addFields({
        date: '$_id',
        value: '$count',
      })
      .sort({ date: 1 })
      .project({
        _id: 0,
        count: 0,
      });
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

  extractUserPreviewFromFullProfile(
    userFullProfile: UserFullProfile,
  ): UserPreview {
    return {
      id: userFullProfile.cursusUser.user.id,
      login: userFullProfile.cursusUser.user.login,
      imgUrl: userFullProfile.cursusUser.user.image.link,
    };
  }
}
