import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  findOneAndLean,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
import type { IntPerCircle } from 'src/page/home/user/models/home.user.model';
import { quests_user } from './db/questsUser.database.schema';

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
export class QuestsUserService {
  constructor(
    @InjectModel(quests_user.name)
    private readonly questsUserModel: Model<quests_user>,
  ) {}

  async findOneAndLean(
    queryOneArgs: QueryOneArgs<quests_user>,
  ): Promise<quests_user | null> {
    return await findOneAndLean(this.questsUserModel, queryOneArgs);
  }

  async firstCircleDuration(userId?: number): Promise<IntPerCircle> {
    const aggregate = this.questsUserModel.aggregate<IntPerCircle>();

    if (userId) {
      aggregate.match({ 'user.id': userId });
    }

    const firstCircle = await aggregate
      .lookup({
        from: 'cursus_users',
        localField: 'user.id',
        foreignField: 'user.id',
        as: 'cursus_user',
      })
      .project({
        _id: 0,
        beginAt: { $arrayElemAt: ['$cursus_user.beginAt', 0] },
        quest: 1,
        user: 1,
        validatedAt: 1,
      })
      .match({ 'quest.id': { $in: [44] } })
      .group({
        _id: '$user.id',
        startTime: { $first: '$beginAt' },
        endTime: {
          $max: {
            $cond: [{ $eq: ['$quest.id', 44] }, '$validatedAt', null],
          },
        },
      })
      .match({ startTime: { $ne: null }, endTime: { $ne: null } })
      .project({
        duration: {
          $dateDiff: {
            startDate: '$startTime',
            endDate: '$endTime',
            unit: 'day',
          },
        },
      })
      .match({ duration: { $gte: 0 } })
      .group({
        _id: null,
        avgValue: { $avg: '$duration' },
      })
      .addFields({
        value: { $round: ['$avgValue'] },
      });

    return { circle: 0, value: firstCircle.length ? firstCircle[0].value : 0 };
  }

  async averageDuartionPerCircle(userId?: number): Promise<IntPerCircle[]> {
    const questId = [44, 45, 46, 47, 48, 49, 37] as const;

    const result: IntPerCircle[] = [];

    result.push(await this.firstCircleDuration(userId));

    for (let i = 0; i < questId.length - 1; i++) {
      const aggregate = this.questsUserModel.aggregate<IntPerCircle>();

      if (userId) {
        aggregate.match({ 'user.id': userId });
      }

      const valuePerCircle = await aggregate
        .match({ 'quest.id': { $in: [questId[i], questId[i + 1]] } })
        .group({
          _id: '$user.id',
          startTime: {
            $max: {
              $cond: [{ $eq: ['$quest.id', questId[i]] }, '$validatedAt', null],
            },
          },
          endTime: {
            $max: {
              $cond: [
                { $eq: ['$quest.id', questId[i + 1]] },
                '$validatedAt',
                null,
              ],
            },
          },
        })
        .match({ startTime: { $ne: null }, endTime: { $ne: null } })
        .project({
          duration: {
            $dateDiff: {
              startDate: '$startTime',
              endDate: '$endTime',
              unit: 'day',
            },
          },
        })
        .match({ duration: { $gte: 0 } })
        .group({
          _id: null,
          avgValue: { $avg: '$duration' },
        })
        .addFields({
          value: { $round: ['$avgValue'] },
        });

      result.push(
        ...valuePerCircle.map(({ value }) => ({
          circle: i + 1,
          value: value + result[i].value,
        })),
      );
    }

    return result;
  }

  //async getAverageCircleDurationsByPromo(): Promise<ValuePerCircleByPromo[]> {
  //  const questId: number[] = [44, 45, 46, 47, 48, 49, 37];

  //  const result: ValuePerCircleByPromo[] = [];

  //  //todo: 기수별 0서클 기간 구하기
  //  //result.push(await this.getFirstCircleDurationsByPromo());

  //  for (let i = 0; i < questId.length - 1; i++) {
  //    const aggregate = this.questUserModel.aggregate<ValuePerCircleByPromo>();

  //    const ValuePerCircleByPromo = await aggregate
  //      .lookup({
  //        from: 'cursus_users',
  //        localField: 'user.id',
  //        foreignField: 'user.id',
  //        as: 'cursus_user',
  //      })
  //      .project({
  //        _id: 0,
  //        beginAt: {
  //          $arrayElemAt: ['$cursus_user.beginAt', 0],
  //        },
  //        quest: 1,
  //        user: 1,
  //        validatedAt: 1,
  //      })
  //      .match({ 'quest.id': { $in: [questId[i], questId[i + 1]] } })
  //      .group({
  //        _id: '$user.id',
  //        startTime: {
  //          $max: {
  //            $cond: [{ $eq: ['$quest.id', questId[i]] }, '$validatedAt', null],
  //          },
  //        },
  //        endTime: {
  //          $max: {
  //            $cond: [
  //              { $eq: ['$quest.id', questId[i + 1]] },
  //              '$validatedAt',
  //              null,
  //            ],
  //          },
  //        },
  //        beginAt: {
  //          $first: '$beginAt',
  //        },
  //      })
  //      .match({ startTime: { $ne: null }, endTime: { $ne: null } })
  //      .project({
  //        duration: {
  //          $dateDiff: {
  //            startDate: '$startTime',
  //            endDate: '$endTime',
  //            unit: 'day',
  //          },
  //        },
  //        beginAt: 1,
  //      })
  //      .match({
  //        beginAt: {
  //          $ne: null,
  //        },
  //      })
  //      .group({
  //        _id: {
  //          $dateToString: {
  //            format: '%Y-%m',
  //            date: '$beginAt',
  //          },
  //        },
  //        duration: {
  //          $sum: '$duration',
  //        },
  //      })
  //      .match({ duration: { $gte: 0 } })
  //      .group({
  //        _id: '$_id',
  //        avgValue: { $avg: '$duration' },
  //      })
  //      .addFields({
  //        //date: {
  //        //  $dateToString: {
  //        //    format: "%Y-%m",
  //        //    date: { $toDate: new Date() },
  //        //  },
  //        //},
  //        value: { $round: ['$avgValue'] },
  //        promo: '$_id',
  //      });
  //promo로 정렬 후 반환

  //    result.push(
  //      ...ValuePerCircleByPromo.map(({ value, promo }) => ({
  //        circle: i + 1,
  //        value,
  //        promo,
  //      })),
  //    );
  //  }

  //  return result;
  //}
}
