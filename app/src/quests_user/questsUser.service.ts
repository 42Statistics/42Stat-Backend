import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ValuePerCircle } from 'src/total/models/total.model';
import { quests_user } from './db/questsUser.database.schema';

@Injectable()
export class QuestsUserService {
  constructor(
    @InjectModel(quests_user.name)
    private questUserModel: Model<quests_user>,
  ) {}

  async getAverageCircleDurations(): Promise<ValuePerCircle[]> {
    const questId: number[] = [44, 45, 46, 47, 48, 49, 37];

    const result: ValuePerCircle[] = [];

    for (let i = 0; i < questId.length - 1; i++) {
      const aggregate = this.questUserModel.aggregate<ValuePerCircle>();

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
          difference: {
            $dateDiff: {
              startDate: '$startTime',
              endDate: '$endTime',
              unit: 'day',
            },
          },
        })
        .match({ difference: { $gte: 0 } })
        .group({
          _id: {
            $dateToString: {
              date: 'beginat',
              format: '%Y-%m',
              timezone: 'Asia/Seuol',
            },
          },
          avgValue: { $avg: '$difference' },
        })
        .project({
          _id: 0,
          value: { $round: '$avgValue' },
        });

      result.push(
        ...valuePerCircle.map(({ value }) => ({
          circle: i + 1,
          value,
        })),
      );
    }

    return result;
  }
}
