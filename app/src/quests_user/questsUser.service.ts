import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ValuePerCircle } from 'src/total/models/total.model';
import { quests_user } from './db/questsUser.database.schema';
import { Time } from 'src/util';

@Injectable()
export class QuestsUserService {
  constructor(
    @InjectModel(quests_user.name)
    private questUserModel: Model<quests_user>,
  ) {}
  async getAverageCircleDurations(): Promise<ValuePerCircle[]> {
    //todo?
    const slugArr: string[] = [
      'common-core',
      'common-core-rank-00',
      'common-core-rank-01',
      'common-core-rank-02',
      'common-core-rank-03',
      'common-core-rank-04',
      'common-core-rank-05',
      'exam-rank-06',
    ];

    const result: ValuePerCircle[] = [];

    for (let i = 0; i < slugArr.length - 1; i++) {
      const aggregate = this.questUserModel.aggregate<ValuePerCircle>();

      const valuePerCircle = await aggregate
        .match({ 'quest.slug': { $in: [slugArr[i], slugArr[i + 1]] } })
        .group({
          _id: '$user.id',
          startTime: {
            $max: {
              $cond: [{ $eq: ['$quest.slug', slugArr[i]] }, '$createdAt', null],
            },
          },
          endTime: {
            $max: {
              $cond: [
                { $eq: ['$quest.slug', slugArr[i + 1]] },
                '$updatedAt',
                null,
              ],
            },
          },
        })
        .match({ startTime: { $ne: null }, endTime: { $ne: null } })
        .project({
          _id: 1,
          difference: { $subtract: ['$endTime', '$startTime'] },
        })
        .match({ difference: { $gte: 0 } })
        .group({
          _id: 0,
          value: { $avg: '$difference' },
        })
        .project({
          _id: 0,
          value: { $round: { $divide: ['$value', Time.DAY] } },
        });

      result.push(
        ...valuePerCircle.map(({ value }) => ({
          circle: i,
          value,
        })),
      );
    }

    return result;
  }
}
