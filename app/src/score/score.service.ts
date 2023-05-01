import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { FilterQuery, Model } from 'mongoose';
import { CoalitionsUserService } from 'src/coalitions_user/coalitionsUser.service';
import { CursusUserService } from 'src/cursus_user/cursusUser.service';
import { score } from './db/score.database.schema';
import {
  CoalitionScore,
  CoalitionScoreRecords,
} from './models/score.coalition.model';
import { UserRanking } from 'src/common/models/common.user.model';
import { UserScoreRank } from 'src/personalGeneral/models/personal.general.userProfile.model';
@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(score.name)
    private scoreModel: Model<score>,
    private cursusUserService: CursusUserService,
    private coalitionsUserService: CoalitionsUserService,
  ) {}
  async getScoresByCoalition(): Promise<CoalitionScore[]> {
    const aggregate = this.scoreModel.aggregate<CoalitionScore>();

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

  async getScoreRecords(
    filter?: FilterQuery<score>,
  ): Promise<CoalitionScoreRecords[]> {
    const aggregate = this.scoreModel.aggregate<CoalitionScoreRecords>();

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

  // async getScoreRanks(
  //   limit: number,
  //   filter?: FilterQuery<score>,
  // ): Promise<UserRankingCoalitionId[]> {
  //   const aggregate = this.scoreModel.aggregate<UserRankingCoalitionId>();

  //   if (filter) {
  //     aggregate.match(filter);
  //   }

  //   return await aggregate
  //     .match({ coalitionsUserId: { $ne: null } })
  //     .group({ _id: '$coalitionsUserId', value: { $sum: '$value' } })
  //     .sort({ value: -1 })
  //     .limit(limit)
  //     .lookup({
  //       from: 'coalitions_users',
  //       localField: '_id',
  //       foreignField: 'id',
  //       as: 'coalitionsUser',
  //     })
  //     .lookup({
  //       from: 'users',
  //       localField: 'coalitionsUser.userId',
  //       foreignField: 'id',
  //       as: 'user',
  //     })
  //     .match({
  //       'user.active?': true,
  //     })
  //     .project({
  //       _id: 0,
  //       userPreview: {
  //         id: { $first: '$user.id' },
  //         login: { $first: '$user.login' },
  //         imgUrl: { $first: '$user.image.link' },
  //       },
  //       value: 1,
  //       coalitionId: { $first: '$coalitionsUser.coalitionId' },
  //     });
  // }

  // async getUserScoreRank(
  //   uid: number,
  //   filter?: FilterQuery<score>,
  // ): Promise<UserScoreRank> {
  //   const rankInTotalArr: UserRankingCoalitionId[] = await this.getScoreRanks();

  //   const emptyScore = await this.cursusUserService.getEmptyScoreUser(filter);

  //   rankInTotalArr.push(...emptyScore);
  //   rankInTotalArr.sort((a, b) => b.value - a.value);

  //   const userRanking = rankInTotalArr.find(
  //     (rankInTotal: UserRankingCoalitionId) =>
  //       rankInTotal.userPreview.id === uid,
  //   );
  //   const coalitionId = userRanking?.coalitionId;
  //   const value = userRanking?.value;

  //   const rankInCoalitionArr: UserRanking[] = rankInTotalArr.filter(
  //     (rankInTotal) => rankInTotal.coalitionId === coalitionId,
  //   );

  //   const findTotalRankById = (rankInTotalArr: UserRanking) =>
  //     rankInTotalArr.userPreview.id === uid;
  //   const findCoalitionRankById = (rankInCoalitionArr: UserRanking) =>
  //     rankInCoalitionArr.userPreview.id === uid;

  //   const rankInCoalition =
  //     rankInCoalitionArr.findIndex(findCoalitionRankById) + 1;
  //   const rankInTotal = rankInTotalArr.findIndex(findTotalRankById) + 1;

  //   if (!value) {
  //     throw new NotFoundException();
  //   }

  //   return {
  //     value,
  //     rankInCoalition,
  //     rankInTotal,
  //   };
  // }
}
