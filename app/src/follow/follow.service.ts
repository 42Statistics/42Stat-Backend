import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursusUserService } from '../api/cursusUser/cursusUser.service';
import { follow } from './db/follow.database.schema';
import { FollowListByMe, FollowResult } from './model/follow.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
    private readonly cursusUserService: CursusUserService,
  ) {}

  // input으로 들어온 유저를 팔로우 함
  async followUser(
    followerId: number,
    followingLogin: string,
  ): Promise<typeof FollowResult> {
    //const follower = await this.cursusUserService
    //  .findOneAndLean({
    //    filter: { 'user.id': followerId },
    //  })
    //  .then((follower) => follower?.user.id);

    const following = await this.cursusUserService
      .findOneAndLean({
        filter: { 'user.login': followingLogin },
      })
      .then((following) => following?.user.id);

    const alreadyFollow = await this.followModel.find({
      userId: followerId,
      followId: following,
    });

    if (!following || followerId === following || !alreadyFollow) {
      return { message: 'fail' };
    }

    const result = await this.followModel
      .create({ userId: followerId, followId: following })
      .then((result) => result.toObject());

    return {
      message: 'OK',
      userId: result.userId,
      followId: result.followId,
    };
  }

  // input으로 들어온 유저를 언팔로우 함
  // todo: unfollow 성공도 같은걸 (상태) 반환해서 이름 다시 지어야함
  async unFollowUser(
    followerId: number,
    followingLogin: string,
  ): Promise<typeof FollowResult> {
    //const follower = await this.cursusUserService
    //  .findOneAndLean({
    //    filter: { 'user.id': followerId },
    //  })
    //  .then((follower) => follower?.user.id);

    const following = await this.cursusUserService
      .findOneAndLean({
        filter: { 'user.login': followingLogin },
      })
      .then((following) => following?.user.id);

    if (!following || followerId === following) {
      return { message: 'fail' };
    }

    const deletedCount = await this.followModel
      .deleteOne({
        userId: followerId,
        followId: following,
      })
      .then((result) => result.deletedCount);

    if (deletedCount === 1) {
      return {
        message: 'OK',
        userId: followerId,
        followId: following,
      };
    } else {
      return {
        message: 'fail',
      };
    }
  }

  // input 유저 <- 팔로워 목록을 찾아옴
  // getFollowerList("yeju") -> yeju를 팔로우 하는 사람들
  async getFollowerList(me: number, target: string): Promise<FollowListByMe[]> {
    //target의 id
    const targetId = await this.cursusUserService
      .findOneAndLean({
        filter: { 'user.login': target },
      })
      .then((user) => user?.user.id);

    //target을 팔로우 하는 사람들
    const follower: follow[] = await this.followModel.find({
      followId: targetId,
    });

    const targetFollowingUserPreview: Promise<UserPreview>[] = follower.map(
      async (follower) => {
        //target을 팔로우 하는 사람의 preview
        const user = await this.cursusUserService
          .findAllUserPreviewAndLean({
            filter: { 'user.id': follower.userId },
          })
          //findOne으로 바꾸기
          .then((a) => a[0]);

        return user;
      },
    );

    const followListByMeArray: Promise<FollowListByMe>[] =
      targetFollowingUserPreview.map(async (targetFollowingUser) => {
        const user = await targetFollowingUser;
        let follow: boolean = true;

        const isFollowed = await this.followModel.find({
          userId: me,
          followId: user.id,
        });

        if (!isFollowed) {
          follow = false;
        }

        return { follow, user };
      });

    return await Promise.all(followListByMeArray);
  }

  // input 유저 -> 팔로잉 목록을 찾아옴
  // getFollowingList("yeju") -> yeju(target)가 팔로우 하는 사람들
  async getFollowingList(
    me: number,
    target: string,
  ): Promise<FollowListByMe[]> {
    //target의 id
    const targetId = await this.cursusUserService
      .findOneAndLean({
        filter: { 'user.login': target },
      })
      .then((user) => user?.user.id);

    //target이 팔로우 하는 사람들
    const following: follow[] = await this.followModel.find({
      userId: targetId,
    });

    const targetFollowingUserPreview: Promise<UserPreview>[] = following.map(
      async (following) => {
        //target이 팔로우 하는 사람의 preview
        const user = await this.cursusUserService
          .findAllUserPreviewAndLean({
            filter: { 'user.id': following.followId },
          })
          //findOne으로 바꾸기
          .then((a) => a[0]);

        return user;
      },
    );

    const followListByMeArray: Promise<FollowListByMe>[] =
      targetFollowingUserPreview.map(async (targetFollowingUser) => {
        const user = await targetFollowingUser;
        let follow: boolean = true;

        const isFollowed = await this.followModel.find({
          userId: me,
          followId: user.id,
        });

        if (!isFollowed) {
          follow = false;
        }

        return { follow, user };
      });

    return await Promise.all(followListByMeArray);
  }

  async getFollowerCount(login: string): Promise<number> {
    const id = await this.cursusUserService.findOneAndLean({
      filter: { 'user.login': login },
    });

    return await this.followModel.countDocuments({ followId: id?.user.id }); //login filter
  }

  async getFollowingCount(login: string): Promise<number> {
    const id = await this.cursusUserService.findOneAndLean({
      filter: { 'user.login': login },
    });

    return await this.followModel.countDocuments({ userId: id?.user.id }); //login filter
  }
}
