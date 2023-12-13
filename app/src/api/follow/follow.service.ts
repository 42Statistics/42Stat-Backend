import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import { follow } from './db/follow.database.schema';
import { FollowSuccess } from './model/follow.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
  ) {}

  // input으로 들어온 유저를 팔로우 함
  async followUser(me: number, login: string): Promise<FollowSuccess> {
    //if (me === login) {
    //  return false;
    //}

    //db.add.me->login
    await this.followModel.create({}).then((result) => result.toObject());

    return {
      message: 'OK',
      userId: 123,
      followId: 312,
    };
  }

  // input으로 들어온 유저를 언팔로우 함
  // todo: unfollow 성공도 같은걸 (상태) 반환해서 이름 다시 지어야함
  async unfollowUser(me: number, login: string): Promise<FollowSuccess> {
    //db.delete.me->login

    //if (me === login) {
    //  return false;
    //}

    return {
      message: 'OK',
      userId: 123,
      followId: 312,
    };
  }

  // input 유저 <- 팔로워 목록을 찾아옴
  async getFollowerList(login: string): Promise<UserPreview[]> {
    //login이 A<-B 의 A위치에 있는거 find 후 B들의 UserPreview로 합쳐서 반환
    return [];
  }

  // input 유저 -> 팔로잉 목록을 찾아옴
  async getFollowingList(login: string): Promise<UserPreview[]> {
    //login이 A<-B 의 B위치에 있는거 find 후 A들의 UserPreview로 합쳐서 반환
    return [];
  }

  async getFollowerCount(login: string): Promise<number> {
    return await this.followModel.countDocuments(); //login filter
  }

  async getFollowingCount(login: string): Promise<number> {
    return await this.followModel.countDocuments(); //login filter
  }
}
