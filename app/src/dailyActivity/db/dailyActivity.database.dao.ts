import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { lookupEvents } from 'src/api/event/db/event.database.aggregate';
import { events } from 'src/api/event/db/event.database.schema';
import { events_users } from 'src/api/eventsUser/db/eventsUser.database.schema';
import { lookupProjects } from 'src/api/project/db/project.database.aggregate';
import { project } from 'src/api/project/db/project.database.schema';
import { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { daily_logtimes } from 'src/dailyLogtime/db/dailyLogtime.database.schema';
import {
  DailyActivityType,
  type DailyDefaultRecord,
  type DailyLogtimeRecord,
  type FindDailyActivityDetailRecordInput,
  type FindDailyActivityDetailRecordOutput,
  type FindDailyActivityRecordInput,
  type FindDailyActivityRecordOutput,
} from '../dailyActivity.dto';

export type DailyActivityDao = {
  findAllRecordByDate: (
    args: FindDailyActivityRecordInput,
  ) => Promise<FindDailyActivityRecordOutput[]>;
  findAllDetailRecordByDate: (
    args: FindDailyActivityDetailRecordInput,
  ) => Promise<FindDailyActivityDetailRecordOutput[]>;
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
                endAt: {
                  $gte: start,
                  $lt: end,
                },
              },
            },
          ]),
          {
            $project: {
              _id: 0,
              id: { $first: `$${events.name}.id` },
              at: { $first: `$${events.name}.endAt` },
              type: { $literal: DailyActivityType.EVENT },
            },
          },
          {
            $match: {
              at: { $ne: null },
            },
          },
        ],
      });
  }

  async findAllDetailRecordByDate({
    userId,
    idsWithType,
  }: FindDailyActivityDetailRecordInput): Promise<
    FindDailyActivityDetailRecordOutput[]
  > {
    const scaleTeamIds = idsWithType
      .filter(
        ({ type }) =>
          type === DailyActivityType.CORRECTED ||
          type === DailyActivityType.CORRECTOR,
      )
      .map(({ id }) => id);

    const eventIds = idsWithType
      .filter(({ type }) => type === DailyActivityType.EVENT)
      .map(({ id }) => id);

    const aggregate =
      this.scaleTeamModel.aggregate<FindDailyActivityDetailRecordOutput>();

    if (scaleTeamIds.length) {
      aggregate
        .match({
          id: { $in: scaleTeamIds },
        })
        .append(lookupProjects('team.projectId', 'id'))
        .project({
          type: {
            $cond: {
              if: { $eq: ['$corrector.id', userId] },
              then: DailyActivityType.CORRECTOR,
              else: DailyActivityType.CORRECTED,
            },
          },
          id: 1,
          correctorLogin: '$corrector.login',
          teamId: '$team.id',
          leaderLogin: {
            $getField: {
              field: 'login',
              input: {
                $first: {
                  $filter: {
                    input: '$team.users',
                    as: 'user',
                    cond: '$$user.leader',
                  },
                },
              },
            },
          },
          // todo: project collection 수정하고 s 삭제
          projectName: { $first: `$${project.name}s.name` },
          beginAt: '$beginAt',
          filledAt: '$filledAt',
        });
    } else {
      aggregate.match({ _id: null });
    }

    if (eventIds.length) {
      aggregate.unionWith({
        coll: events.name,
        pipeline: [
          {
            $match: {
              id: { $in: eventIds },
            },
          },
          {
            $project: {
              type: { $literal: DailyActivityType.EVENT },
              id: 1,
              name: 1,
              location: 1,
              beginAt: 1,
              endAt: 1,
            },
          },
        ],
      });
    }

    return await aggregate;
  }
}
