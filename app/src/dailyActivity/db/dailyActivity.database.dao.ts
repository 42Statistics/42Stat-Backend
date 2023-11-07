import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { daily_logtimes } from 'src/dailyLogtime/db/dailyLogtime.database.schema';
import { lookupEvents } from 'src/api/event/db/event.database.aggregate';
import { events } from 'src/api/event/db/event.database.schema';
import { events_users } from 'src/api/eventsUser/db/eventsUser.database.schema';
import { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import {
  DailyActivityType,
  type DailyDefaultRecord,
  type DailyLogtimeRecord,
  type FindDailyActivityRecordInput,
  type FindDailyActivityRecordOutput,
} from '../dailyActivity.dto';

export type DailyActivityDao = {
  findAllRecordByDate: (
    args: FindDailyActivityRecordInput,
  ) => Promise<FindDailyActivityRecordOutput[]>;
};

@Injectable()
export class DailyActivityDaoImpl implements DailyActivityDao {
  constructor(
    @InjectModel(scale_team.name)
    private readonly scaleTeamModel: Model<scale_team>,
  ) {}

  async findAllRecordByDate({
    userId,
    start,
    end,
  }: FindDailyActivityRecordInput): Promise<FindDailyActivityRecordOutput[]> {
    return await this.scaleTeamModel
      .aggregate<DailyLogtimeRecord | DailyDefaultRecord>()
      .match({
        $or: [{ 'corrector.id': userId }, { 'correcteds.id': userId }],
        filledAt: {
          $gte: start,
          $lt: end,
        },
      })
      .sort({ filledAt: 1 })
      .project({
        _id: 0,
        id: 1,
        at: '$filledAt',
        type: {
          $cond: {
            if: { $eq: ['$corrector.id', userId] },
            then: DailyActivityType.CORRECTOR,
            else: DailyActivityType.CORRECTED,
          },
        },
      })
      .unionWith({
        coll: daily_logtimes.name,
        pipeline: [
          {
            $match: {
              userId,
              date: {
                $gte: start,
                $lt: end,
              },
            },
          },
          {
            $project: {
              _id: 0,
              date: '$date',
              type: { $literal: DailyActivityType.LOGTIME },
              value: 1,
            },
          },
        ],
      })
      .unionWith({
        coll: events_users.name,
        pipeline: [
          {
            $match: {
              userId,
            },
          },
          lookupEvents('eventId', 'id', [
            {
              $match: {
                date: {
                  $gte: start,
                  $lt: end,
                },
              },
            },
          ]),
          {
            $project: {
              _id: 0,
              id: 1,
              at: { $first: `$${events.name}.endAt` },
              type: { $literal: DailyActivityType.EVENT },
            },
          },
          {
            $match: {
              at: { $ne: null },
            },
          },
          {
            $sort: {
              at: 1,
            },
          },
        ],
      });
  }
}
