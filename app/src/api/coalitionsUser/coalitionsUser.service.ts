import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model } from 'mongoose';
import { StatDate } from 'src/statDate/StatDate';
import { coalitions_user } from './db/coalitionsUser.database.schema';

@Injectable()
export class CoalitionsUserService {
  constructor(
    @InjectModel(coalitions_user.name)
    private coalitionsUserModel: Model<coalitions_user>,
  ) {}

  scoreInfo(
    start: Date = new StatDate().startOfMonth(), //todo: 기본 기간 설정
    end: Date = new StatDate().moveMonth(1).startOfMonth(),
    limit?: number,
  ): Aggregate<any> {
    //todo: aggregate type
    const aggregate = this.coalitionsUserModel.aggregate();

    aggregate
      .lookup({
        from: 'cursus_users',
        localField: 'userId',
        foreignField: 'user.id',
        as: 'cursus_users',
      })
      .match({
        $or: [
          { 'cursus_users.blackholedAt': null },
          {
            'cursus_users.blackholedAt': {
              $gte: new StatDate(),
            },
          },
        ],
      })
      .lookup({
        from: 'scores',
        localField: 'id',
        foreignField: 'coalitionsUserId',
        as: 'scores',
        pipeline: [
          {
            $match: {
              createdAt: { $gte: start, $lt: end },
            },
          },
        ],
      })
      .project({
        userId: 1,
        coalitionId: 1,
        scores: {
          $sum: '$scores.value',
        },
      })
      .sort({ scores: -1 });

    if (limit) {
      aggregate.limit(limit);
    }

    return aggregate;
  }
}
