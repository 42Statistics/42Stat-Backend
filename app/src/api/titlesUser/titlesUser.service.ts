import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserTitle } from 'src/page/personalGeneral/models/personal.general.userProfile.model';
import { titles_user } from './db/titlesUser.database.schema';

@Injectable()
export class TitlesUserService {
  constructor(
    @InjectModel(titles_user.name)
    private titlesUserModel: Model<titles_user>,
  ) {}

  async titlesUserProfile(uid: number): Promise<UserTitle[]> {
    const aggregate = this.titlesUserModel.aggregate<UserTitle>();

    return await aggregate
      .match({ userId: uid })
      .lookup({
        from: 'titles',
        localField: 'titleId',
        foreignField: 'id',
        as: 'titles',
      })
      .project({
        id: '$titleId',
        name: { $first: '$titles.name' },
        isSelected: '$selected',
      });
  }
}
