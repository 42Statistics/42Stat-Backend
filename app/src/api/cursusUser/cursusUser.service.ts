import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model } from 'mongoose';
import {
  AggrNumeric,
  AggrNumericPerDate,
} from 'src/common/db/common.db.aggregation';
import { UserPreview, UserRanking } from 'src/common/models/common.user.model';
import type {
  UserCountPerLevels,
  ValuePerCircle,
} from 'src/page/home/models/home.model';
import { Time } from 'src/util';
import {
  CursusUserDatable,
  cursus_user,
} from './db/cursusUser.database.schema';
import { CursusUserProfile } from './models/cursusUser.model';
import { DateRangeArgs } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class CursusUserService {
  constructor(
    @InjectModel(cursus_user.name)
    private cursusUserModel: Model<cursus_user>,
  ) {}

  async findAll(filter: FilterQuery<cursus_user> = {}): Promise<cursus_user[]> {
    return await this.cursusUserModel.find(filter);
  }

  async findOne(filter: FilterQuery<cursus_user> = {}): Promise<cursus_user> {
    const cursusUser = await this.cursusUserModel.findOne(filter);

    if (!cursusUser) {
      throw new NotFoundException();
    }

    return cursusUser;
  }

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.cursusUserModel.aggregate<ReturnType>();
  }

  //todo: function name
  async findUser(userId: number, login: string): Promise<cursus_user> {
    if (userId) {
      return await this.findOne({ 'user.id': userId });
    } else if (login) {
      return await this.findOne({ 'user.login': login });
    } else {
      throw new NotFoundException();
    }
  }

  async findByName(login: string): Promise<cursus_user[]> {
    const result: Map<number, cursus_user> = new Map();

    const prefixMatches = await this.findAll({
      'user.login': { $regex: `^${login}`, $options: 'i' },
    });

    prefixMatches.forEach((prefixMatch) =>
      result.set(prefixMatch.id, prefixMatch),
    );

    const matches = await this.findAll({
      'user.login': { $regex: login, $options: 'i' },
    });

    matches.forEach((prefixMatch) => result.set(prefixMatch.id, prefixMatch));

    return [...result.values()];
  }

  convertToPreview(cursusUser: cursus_user): UserPreview {
    return {
      id: cursusUser.user.id,
      login: cursusUser.user.login,
      imgUrl: cursusUser.user.image.link,
    };
  }

  async userCount(filter?: FilterQuery<cursus_user>): Promise<number> {
    if (!filter) {
      return await this.cursusUserModel.estimatedDocumentCount();
    }

    return await this.cursusUserModel.countDocuments(filter);
  }

  async countPerMonth(
    dateRange: DateRangeArgs,
    key: CursusUserDatable,
  ): Promise<AggrNumericPerDate[]> {
    const dateObject = Time.dateToBoundariesObject(dateRange);

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

  async cursusUserProfile(userId: number): Promise<CursusUserProfile> {
    const aggregate = this.cursusUserModel.aggregate<CursusUserProfile>();

    const cursusUserProfile = await aggregate
      .match({ cursusId: 21, 'user.id': userId })
      .lookup({
        from: 'coalitions_users',
        localField: 'user.id',
        foreignField: 'userId',
        as: 'coalitions_users',
      })
      .lookup({
        from: 'coalitions',
        localField: 'coalitions_users.coalitionId',
        foreignField: 'id',
        as: 'coalitions',
      })
      .project({
        _id: 0,
        id: '$user.id',
        login: '$user.login',
        grade: '$grade',
        name: '$user.displayname',
        coalition: { $first: '$coalitions' },
        imgUrl: '$user.image.link',
        level: '$level',
        // beginAt: '$beginAt',
        // blackholedAt: '$blackholedAt',
        // wallet: '$user.wallet',
        // correctionPoint: '$user.correctionPoint',
      })
      .project({ 'coalition._id': 0 });

    if (!cursusUserProfile.length) {
      throw new NotFoundException();
    }

    return cursusUserProfile[0];
  }

  async userLevelRank(
    userId: number,
    filter?: FilterQuery<cursus_user>,
  ): Promise<number> {
    const aggregate = this.cursusUserModel.aggregate<AggrNumeric>();

    if (filter) {
      aggregate.match(filter);
    }

    aggregate.append({
      $setWindowFields: {
        partitionBy: 'level',
        sortBy: { level: -1 },
        output: { value: { $rank: {} } },
      },
    });

    const levelRank = await aggregate.match({ 'user.id': userId });

    if (!levelRank.length) {
      throw new NotFoundException();
    }

    return levelRank[0].value;
  }

  async userCountPerLevels(): Promise<UserCountPerLevels[]> {
    const aggregate = this.cursusUserModel.aggregate<UserCountPerLevels>();

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

  async rank(
    key: string,
    limit: number,
    filter?: FilterQuery<cursus_user>,
  ): Promise<UserRanking[]> {
    const aggregate = this.cursusUserModel.aggregate<UserRanking>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
      .match({ 'user.active?': true })
      .match({ 'user.kind': 'student' })
      .sort({ [`${key}`]: -1 })
      .limit(limit)
      .project({
        _id: 0,
        userPreview: {
          id: '$user.id',
          login: '$user.login',
          imgUrl: '$user.image.link',
        },
        value: `$${key}`,
      });
  }

  // executionTimeMillisEstimate: 319
  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    const aggregate = this.cursusUserModel.aggregate<ValuePerCircle>();

    return await aggregate
      .match({
        blackholedAt: {
          $ne: null,
          $lt: Time.now(),
        },
      })
      .lookup({
        from: 'quests_users',
        localField: 'user.id',
        foreignField: 'user.id',
        pipeline: [
          {
            $match: {
              validatedAt: {
                $ne: null,
              },
              'quest.slug': {
                $ne: 'exam-rank-06',
              },
            },
          },
          {
            $project: {
              validatedAt: 1,
              slug: '$quest.slug',
            },
          },
        ],
        as: 'quests_users',
      })
      .unwind({
        path: '$quests_users',
        preserveNullAndEmptyArrays: true,
      })
      .group({
        _id: '$user.id',
        slug: {
          $addToSet: '$quests_users.slug',
        },
      })
      .addFields({
        size: {
          $size: '$slug',
        },
      })
      .group({
        _id: '$size',
        value: {
          $count: {},
        },
      })
      .addFields({
        circle: '$_id',
      })
      .project({
        _id: 0,
        circle: 1,
        value: 1,
      })
      .sort({
        circle: 1,
      });
  }
}
