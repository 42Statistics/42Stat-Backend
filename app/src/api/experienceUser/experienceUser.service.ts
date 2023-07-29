import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { assertExist } from 'src/common/assertExist';
import { addRank } from 'src/common/db/common.db.aggregation';
import type { UserRank } from 'src/common/models/common.user.model';
import type { LevelRecord } from 'src/page/personal/general/models/personal.general.model';
import { DateWrapper } from 'src/statDate/StatDate';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import type { cursus_user } from '../cursusUser/db/cursusUser.database.schema';
import type { level } from '../level/db/level.database.schema';
import { LevelService } from '../level/level.service';
import { addUserPreview } from '../user/db/user.database.aggregate';
import { lookupExperienceUsers } from './db/experiecneUser.database.aggregate';
import { experience_user } from './db/experienceUser.database.schema';

@Injectable()
export class ExperienceUserService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly levelService: LevelService,
  ) {}

  async increamentRanking(
    filter?: FilterQuery<experience_user>,
  ): Promise<UserRank[]> {
    const aggregate = this.cursusUserService.aggregate<UserRank>();

    return await aggregate
      .append(
        lookupExperienceUsers(
          'user.id',
          'userId',
          filter ? [{ $match: filter }] : undefined,
        ),
      )
      .addFields({ value: { $sum: '$experience_users.experience' } })
      .append(addRank())
      .append(addUserPreview('user'))
      .project({
        _id: 0,
        userPreview: 1,
        value: 1,
        rank: 1,
      });
  }

  async levelRecords(
    beginAt: Date,
    filter?: FilterQuery<cursus_user>,
  ): Promise<LevelRecord[]> {
    const levelTable: Pick<level, 'lvl' | 'xp'>[] =
      await this.levelService.findAllAndLean({
        sort: { lvl: 1 },
        select: { lvl: 1, xp: 1 },
      });
    const userCount = await this.cursusUserService.userCount(filter);
    const aggregate = this.cursusUserService.aggregate<{
      _id: number;
      value: number;
    }>();

    if (filter) {
      aggregate.match(filter);
    }

    const experiences = await aggregate
      .append(lookupExperienceUsers('user.id', 'userId'))
      .unwind({ path: '$experience_users' })
      .addFields({
        diff: {
          $floor: {
            $divide: [
              {
                $dateDiff: {
                  startDate: '$beginAt',
                  endDate: '$experience_users.createdAt',
                  unit: 'millisecond',
                },
              },
              DateWrapper.DAY * 30,
            ],
          },
        },
      })
      .match({ diff: { $ne: null, $lt: 24 } })
      .group({
        _id: '$diff',
        value: { $sum: '$experience_users.experience' },
      })
      .sort({ _id: 1 });

    const [experienceRecords] = experiences.reduce(
      ([records, accExp], { _id: monthIndex, value: exp }) => {
        while (records.length < monthIndex + 1) {
          records.push(records.at(-1) ?? 0);
        }

        const newExp = accExp + exp;

        records.push(
          calculateLevel(levelTable, Math.floor(newExp / userCount)),
        );

        return [records, newExp] as const;
      },
      [[], 0] as readonly [number[], number],
    );

    const gapFromBeginAt = Math.min(
      Math.ceil(
        DateWrapper.dateGap(new Date(), beginAt) / (DateWrapper.DAY * 30),
      ),
      24,
    );

    while (experienceRecords.length <= gapFromBeginAt) {
      experienceRecords.push(experienceRecords.at(-1) ?? 0);
    }

    return experienceRecords.map((record, index) => ({
      monthsPassed: index,
      level: record,
    }));
  }
}

const calculateLevel = (
  levelTable: Pick<level, 'lvl' | 'xp'>[],
  exp: number,
): number => {
  const upper = levelTable.find(({ xp }) => xp > exp);
  assertExist(upper);

  const { lvl: upperLevel, xp: upperNeed } = upper;
  const { lvl: lowerLevel, xp: lowerNeed } = levelTable[upperLevel - 1];

  const levelFloat =
    Math.floor(
      (1 + (exp - upperNeed) / (1.0 * (upperNeed - lowerNeed))) * 100 +
        Number.EPSILON,
    ) / 100;

  return Math.floor((lowerLevel + levelFloat) * 100 + Number.EPSILON) / 100;
};
