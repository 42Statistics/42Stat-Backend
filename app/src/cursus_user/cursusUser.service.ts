import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import {
  AggrNumeric,
  AggrValuePerDate,
} from 'src/common/db/common.db.aggregation';
import { UserRanking } from 'src/common/models/common.user.model';
import {
  UserCountPerLevel,
  ValuePerCircle,
} from 'src/total/models/total.model';
import { Time } from 'src/util';
import {
  CursusUserDatable,
  cursus_user,
} from './db/cursusUser.database.schema';
import { CursusUserProfile } from './models/cursusUser.model';

@Injectable()
export class CursusUserService {
  constructor(
    @InjectModel(cursus_user.name)
    private cursusUserModel: Model<cursus_user>,
  ) {}

  async getUserCount(filter?: FilterQuery<cursus_user>): Promise<number> {
    if (!filter) {
      return await this.cursusUserModel.estimatedDocumentCount();
    }

    return await this.cursusUserModel.countDocuments(filter);
  }

  async countPerMonth(
    start: Date,
    end: Date,
    key: CursusUserDatable,
  ): Promise<AggrValuePerDate[]> {
    const dateObject = Time.dateToBoundariesObject(start, end);

    const aggregate = this.cursusUserModel.aggregate<AggrValuePerDate>();

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

  async getCursusUserProfile(uid: number): Promise<CursusUserProfile> {
    const aggregate = this.cursusUserModel.aggregate<CursusUserProfile>();

    const cursusUserProfile = await aggregate
      .match({ cursusId: 21, 'user.id': uid })
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
        beginAt: '$beginAt',
        blackholedAt: '$blackholedAt',
        wallet: '$user.wallet',
        correctionPoint: '$user.correctionPoint',
      })
      .project({ 'coalition._id': 0 });

    if (!cursusUserProfile.length) {
      throw new NotFoundException();
    }

    return cursusUserProfile[0];
  }

  async getLevelRankById(
    uid: number,
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

    const levelRank = await aggregate.match({ 'user.id': uid });

    if (!levelRank.length) {
      throw new NotFoundException();
    }

    return levelRank[0].value;
  }

  async getUserCountPerLevel(): Promise<UserCountPerLevel[]> {
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
      .sort({ level: -1 });
  }

  async getRank(
    key: string,
    limit: number = 3, //todo: limit 초기값 설정, eslint
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
  async getBlackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    const aggregate = this.cursusUserModel.aggregate<ValuePerCircle>();

    return await aggregate
      .match({
        blackholedAt: {
          $ne: null,
          $lt: Time.curr(),
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
