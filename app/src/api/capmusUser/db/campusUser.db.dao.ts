import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheUtilService } from 'src/cache/cache.util.service';
import { DateWrapper } from 'src/dateWrapper/dateWrapper';
import { campus_user } from './campusUser.db.schema';

@Injectable()
export class CampusUserDao {
  constructor(
    @InjectModel(campus_user.name)
    private readonly campusUserModel: Model<campus_user>,
    private readonly cacheUtilService: CacheUtilService,
  ) {}

  private static readonly transferOutUserIdsKey = 'transferOutUserIds';
  async findAllTransferOutUserId(): Promise<number[]> {
    const cached = await this.cacheUtilService.get<number[]>(
      CampusUserDao.transferOutUserIdsKey,
    );

    if (cached !== undefined) {
      return cached;
    }

    const queryResult = await this.campusUserModel.find(
      { isPrimary: false },
      { _id: 0, userId: 1 },
    );

    const userIdList = queryResult.map(({ userId }) => userId);
    console.log(JSON.stringify(userIdList, null, 2));

    await this.cacheUtilService.set(
      CampusUserDao.transferOutUserIdsKey,
      userIdList,
      DateWrapper.MIN * 5,
    );

    return userIdList;
  }
}
