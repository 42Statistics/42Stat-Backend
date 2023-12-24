import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import {
  QueryArgs,
  findAllAndLean,
} from 'src/database/mongoose/database.mongoose.query';
import { CursusUserService } from '../api/cursusUser/cursusUser.service';
import { follow } from './db/follow.database.schema';
import type { FollowList, FollowResult } from './model/follow.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
    private readonly cursusUserService: CursusUserService,
  ) {}

  async findAllAndLean(queryArgs?: QueryArgs<follow>): Promise<follow[]> {
    return await findAllAndLean(this.followModel, queryArgs);
  }

  // 프론트 테스트용 임시 함수
  async MakeFollowUser(
    to: string,
    from: string,
    type: 'follow' | 'unfollow',
  ): Promise<typeof FollowResult> {
    const userId = await this.cursusUserService.getuserIdByLogin(from);
    if (type === 'follow') {
      return await this.followUser(userId!, to);
    } else if (type === 'unfollow') {
      return await this.unfollowUser(userId!, to);
    }
    return { message: 'fail' };
  }

  async followUser(
    userId: number,
    target: string,
  ): Promise<typeof FollowResult> {
    const following = await this.cursusUserService.getuserIdByLogin(target);

    const alreadyFollow = await this.followModel.find({
      userId: userId,
      followId: following,
    });

    // !following은 throw notfound 이긴 함
    if (!following || userId === following || alreadyFollow.length) {
      return { message: 'fail' };
    }

    const result = await this.followModel
      .create({ userId: userId, followId: following })
      .then((result) => result.toObject());

    return {
      message: 'OK',
      userId: result.userId,
      followId: result.followId,
    };
  }

  // todo: unfollow 성공도 같은걸 (상태) 반환해서 이름 다시 지어야함
  async unfollowUser(
    userId: number,
    target: string,
  ): Promise<typeof FollowResult> {
    const following = await this.cursusUserService.getuserIdByLogin(target);

    if (!following || userId === following) {
      return { message: 'fail' };
    }

    const deletedCount = await this.followModel
      .deleteOne({
        userId: userId,
        followId: following,
      })
      .then((result) => result.deletedCount);

    if (deletedCount === 1) {
      return {
        message: 'OK',
        userId: userId,
        followId: following,
      };
    }

    return { message: 'fail' };
  }

  // getFollowerList("yeju") -> yeju를 팔로우 하는 사람들
  async getFollowerList(userId: number, target: string): Promise<FollowList[]> {
    //target의 id
    const targetId = await this.cursusUserService.getuserIdByLogin(target);

    if (!targetId) {
      throw new NotFoundException();
    }

    //target을 팔로우 하는 사람들
    const follower: follow[] = await this.findAllAndLean({
      filter: { followId: targetId },
      sort: { _id: 'desc' },
    });

    const followerUserPreview: UserPreview[] = await Promise.all(
      follower.map(async (follower) => {
        //target을 팔로우 하는 사람의 preview
        const userPreview =
          await this.cursusUserService.findOneUserPreviewAndLean({
            filter: { 'user.id': follower.userId },
          });

        if (!userPreview) {
          throw new NotFoundException();
        }

        return userPreview;
      }),
    );

    const followerList = await this.checkFollowingStatus(
      userId,
      followerUserPreview,
    );

    return followerList;
  }

  // getFollowingList("yeju") -> yeju(target)가 팔로우 하는 사람들
  async getFollowingList(
    userId: number,
    target: string,
  ): Promise<FollowList[]> {
    const targetId = await this.cursusUserService.getuserIdByLogin(target);

    if (!targetId) {
      throw new NotFoundException();
    }

    //target이 팔로우 하는 사람들
    const following: follow[] = await this.findAllAndLean({
      filter: { userId: targetId },
      sort: { _id: 'desc' },
    });

    const followingUserPreview: UserPreview[] = await Promise.all(
      following.map(async (following) => {
        //target을 팔로우 하는 사람의 preview
        const userPreview =
          await this.cursusUserService.findOneUserPreviewAndLean({
            filter: { 'user.id': following.followId },
          });

        if (!userPreview) {
          throw new NotFoundException();
        }

        return userPreview;
      }),
    );

    const followingList = await this.checkFollowingStatus(
      userId,
      followingUserPreview,
    );

    return followingList;
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

  async checkFollowingStatus(
    userId: number,
    userPreview: UserPreview[],
  ): Promise<FollowList[]> {
    const followList = userPreview.map(async (user) => {
      if (!user) {
        throw new NotFoundException();
      }

      let isFollowing: boolean | undefined = undefined;

      if (userId !== user.id) {
        const isFollowed = await this.followModel.findOne({
          userId: userId,
          followId: user.id,
        });

        isFollowing = !!isFollowed;
      }

      return { isFollowing, user };
    });

    return Promise.all(followList);
  }
}
