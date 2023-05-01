import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { UserTitle } from 'src/personalGeneral/models/personal.general.userProfile.model';
import { titles_user } from './db/titlesUser.database.schema';

@Injectable()
export class TitlesUserService {
  constructor(
    @InjectModel(titles_user.name)
    private titlesUserModel: Model<titles_user>,
  ) {}

  async getTitlesUserProfile(uid: number): Promise<UserTitle[]> {
    const aggregate = this.titlesUserModel.aggregate<UserTitle>();

    //todo: titles 저장되면 이거 반환하기
    const titlesUserProfile = await aggregate
      .match({ userId: uid })
      .lookup({
        from: 'titles',
        localField: 'titleId',
        foreignField: 'id',
        as: 'titles',
      })
      .project({
        id: '$titleId',
        name: '$titles.name',
        isSelected: '$selected',
      });

    return [
      {
        id: 1,
        name: "%login Officially Developer of 24HANE(42Seoul's attendance managing system)",
        isSelected: true,
      },
      {
        id: 2,
        name: '%login Librarian of Jiphyeonjeon :books:',
        isSelected: false,
      },
      {
        id: 3,
        name: 'Philanthropist %login',
        isSelected: false,
      },
    ];
  }
}
