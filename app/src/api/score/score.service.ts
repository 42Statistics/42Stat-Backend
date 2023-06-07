import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { score } from './db/score.database.schema';
import type {
  ScoreRecordPerCoalition,
  IntPerCoalition,
} from 'src/page/home/coalition/models/home.coalition.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { lookupScores } from './db/score.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { addUserPreview } from '../cursusUser/db/cursusUser.database.aggregate';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(score.name)
    private scoreModel: Model<score>,
    private cursusUserService: CursusUserService,
  ) {}

  async scoresPerCoalition(): Promise<IntPerCoalition[]> {
    const aggregate = this.scoreModel.aggregate<IntPerCoalition>();

    return await aggregate
      .match({ coalitionsUserId: { $ne: null } })
      .group({ _id: '$coalitionId', value: { $sum: '$value' } })
      .lookup({
        from: 'coalitions',
        localField: '_id',
        foreignField: 'id',
        as: 'coalition',
      })
      .sort({ _id: 1 })
      .project({ _id: 0, coalition: { $first: '$coalition' }, value: 1 });
  }

  async scoreRecordsPerCoalition(
    filter?: FilterQuery<score>,
  ): Promise<ScoreRecordPerCoalition[]> {
    const aggregate = this.scoreModel.aggregate<ScoreRecordPerCoalition>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
      .group({
        _id: {
          coalitionId: '$coalitionId',
          at: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
              timezone: process.env.TZ,
            },
          },
        },
        value: { $sum: '$value' },
      })
      .sort({ '_id.at': 1 })
      .group({
        _id: '$_id.coalitionId',
        records: {
          $push: {
            at: { $dateFromString: { dateString: '$_id.at' } },
            value: '$value',
          },
        },
      })
      .sort({ coalitionId: 1 })
      .lookup({
        from: 'coalitions',
        localField: '_id',
        foreignField: 'id',
        as: 'coalition',
      })
      .project({ _id: 0, coalition: { $first: '$coalition' }, records: 1 });
  }

  // 전체 범위 가져올때 3초
  async scoreRank(filter?: FilterQuery<score>): Promise<UserRanking[]> {
    const aggregate = this.cursusUserService.aggregate<UserRanking>();

    return await aggregate
      .append(lookupCoalitionsUser('user.id', 'userId'))
      .addFields({ coalitions_users: { $first: '$coalitions_users' } })
      .append(
        lookupScores(
          'coalitions_users.id',
          'coalitionsUserId',
          filter ? [{ $match: filter }] : undefined,
        ),
      )
      .addFields({
        scores: {
          $sum: '$scores.value',
        },
      })
      .append({
        $setWindowFields: {
          sortBy: { scores: -1 },
          output: {
            rank: { $rank: {} },
          },
        },
      })
      .append(addUserPreview('user'))
      .project({
        _id: 0,
        userProfile: 1,
        value: '$scores',
        rank: 1,
      });
  }
}
