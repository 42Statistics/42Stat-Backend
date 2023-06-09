import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { experience_user } from './db/experienceUser.database.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserRanking } from 'src/common/models/common.user.model';
import { CursusUserService } from '../cursusUser/cursusUser.service';
import { lookupExperienceUsers } from './db/experiecneUser.database.aggregate';
import { addRank } from 'src/common/db/common.db.aggregation';
import { addUserPreview } from '../cursusUser/db/cursusUser.database.aggregate';

@Injectable()
export class ExperienceUserService {
  constructor(
    // eslint-disable-next-line
    @InjectModel(experience_user.name)
    private experienceUserModel: Model<experience_user>,
    private cursusUserService: CursusUserService,
  ) {}

  async increamentRanking(
    filter?: FilterQuery<experience_user>,
  ): Promise<UserRanking[]> {
    const aggregate = this.cursusUserService.aggregate<UserRanking>();

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
}
