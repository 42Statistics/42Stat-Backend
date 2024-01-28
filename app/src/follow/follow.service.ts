import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import { UserPreview } from 'src/common/models/common.user.model';
import {
  QueryArgs,
  QueryOneArgs,
  findAllAndLean,
  findOneAndLean,
} from 'src/database/mongoose/database.mongoose.query';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import { follow } from './db/follow.database.schema';
import {
  FollowSortOrder,
  type FollowListPaginatedArgs,
} from './dto/follow.dto.getFollowList';
import { FollowCacheService } from './follow.cache.service';
import type {
  FollowList,
  FollowListCacheType,
  FollowListPaginated,
  FollowSuccess,
} from './model/follow.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly paginationIndexService: PaginationIndexService,
    private readonly followCacheService: FollowCacheService,
  ) {}

  async findOneAndLean(
    queryOneArgs?: QueryOneArgs<follow>,
  ): Promise<follow | null> {
    return await findOneAndLean(this.followModel, queryOneArgs);
  }

  async findAllAndLean(queryArgs?: QueryArgs<follow>): Promise<follow[]> {
    return await findAllAndLean(this.followModel, queryArgs);
  }

  async followUser(userId: number, targetId: number): Promise<FollowSuccess> {
    //1. 이미 팔로우 한 유저인지 확인
    const alreadyFollow = await this.followModel.findOne(
      {
        userId,
        followId: targetId,
      },
      { _id: 1 },
    );

    //2. 이미 팔로우 했거나, 자기 자신을 팔로우 하려는 경우 404 반환
    if (userId === targetId || alreadyFollow) {
      throw new NotFoundException();
    }

    const followAt = new Date();

    const target = await this.cursusUserCacheService.getUserPreview(targetId);

    if (!target) {
      throw new NotFoundException();
    }

    //3. db에 write
    console.log(`write in db: ${userId}, ${targetId}`);
    await this.followModel.create({
      userId,
      followId: targetId,
      followAt,
    });

    //4. cache update (팔로우 한 시점, 팔로우 한 유저의 userpreview 가져와서 기록)
    //4-1. following list update
    const cachedfollowingList = await this.followCacheService.get(
      userId,
      'following',
    );

    cachedfollowingList.push({ userPreview: target, followAt });

    await this.followCacheService.set({
      id: userId,
      type: 'following',
      list: cachedfollowingList,
    });

    //4-2. follower list update
    const cachedfollowerList = await this.followCacheService.get(
      targetId,
      'following',
    );

    const userPreview = await this.cursusUserCacheService.getUserPreview(
      userId,
    );

    if (!userPreview) {
      throw new NotFoundException();
    }

    cachedfollowerList.push({ userPreview, followAt });

    await this.followCacheService.set({
      id: targetId,
      type: 'follower',
      list: cachedfollowerList,
    });

    return {
      userId,
      followId: targetId,
    };
  }

  async unfollowUser(userId: number, targetId: number): Promise<FollowSuccess> {
    //1. 팔로우 중이었는지 확인
    const existingFollow = await this.followModel.findOne(
      {
        userId,
        followId: targetId,
      },
      { _id: 1 },
    );

    //2. 팔로우 하고 있지 않았거나, 자기 자신 언팔로우는 404 반환
    if (!existingFollow || userId === targetId) {
      throw new NotFoundException();
    }

    //3. db에서
    console.log(`delete from db: ${userId}, ${targetId}`);
    const deletedCount = await this.followModel
      .deleteOne({
        userId,
        followId: targetId,
      })
      .then((result) => result.deletedCount);

    if (deletedCount !== 1) {
      throw new NotFoundException();
    }

    //4. cache update
    //4-1. following list update
    const cachedFollowingList = await this.followCacheService.get(
      userId,
      'following',
    );

    const updatedFollowingList = cachedFollowingList.filter(
      (follow) => follow.userPreview.id !== targetId,
    );

    await this.followCacheService.set({
      id: userId,
      type: 'following',
      list: updatedFollowingList,
    });

    //4-2. follower list update
    const cachedFollowerList = await this.followCacheService.get(
      targetId,
      'follower',
    );

    const updatedFollowerList = cachedFollowerList.filter(
      (follow) => follow.userPreview.id !== userId,
    );

    await this.followCacheService.set({
      id: targetId,
      type: 'follower',
      list: updatedFollowerList,
    });

    return {
      userId,
      followId: targetId,
    };
  }

  async followerList(
    userId: number,
    targetId: number,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<FollowList[]> {
    const aggregate = this.followModel.aggregate<follow>();

    const cachedFollowerList = await this.followCacheService.get(
      targetId,
      'follower',
    );

    if (cachedFollowerList.length) {
      console.log(`return cachedFollowerList`);

      console.log(`start cached checkFollowing: ${new Date().getTime()}`);
      const a = await this.checkFollowing({
        userId,
        cachedFollowList: cachedFollowerList,
      });
      console.log(`finish cached checkFollowing: ${new Date().getTime()}`);
      return a;
    }

    console.log(`dont have followerList cache`);
    console.log(`start non-cached checkFollowing: ${new Date().getTime()}`);

    if (filter) {
      aggregate.match(filter);
    }

    const follower: Pick<follow, 'userId' | 'followAt'>[] =
      await this.findAllAndLean({
        filter: { followId: targetId },
        select: { _id: 0, userId: 1, followAt: 1 },
        sort: followSort(sortOrder),
      });

    const followerUserPreview = await Promise.all(
      follower.map(async (follower) => {
        const userFullProfile = await this.cursusUserCacheService
          .getUserFullProfile(follower.userId)
          .then((user) => user?.cursusUser.user);

        if (!userFullProfile) {
          throw new NotFoundException();
        }

        const userPreview = {
          id: userFullProfile.id,
          login: userFullProfile.login,
          imgUrl: userFullProfile.image.link,
        };

        if (!userPreview) {
          throw new NotFoundException();
        }

        return { userPreview, followAt: follower.followAt };
      }),
    );

    const followerList = await this.checkFollowing({
      userId,
      cachedFollowList: followerUserPreview,
    });

    console.log(`finish non-cached checkFollowing: ${new Date().getTime()}`);
    await this.followCacheService.set({
      id: targetId,
      type: 'follower',
      list: followerList,
    });

    console.log(`finish setting cache: ${new Date().getTime()}`);
    return followerList;
  }

  async followerPaginated(
    userId: number,
    { pageNumber, pageSize, targetId, sortOrder }: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    const followList = await this.followerList(userId, targetId, sortOrder);

    return this.paginationIndexService.toPaginated<FollowList>(followList, {
      pageNumber,
      pageSize,
    });
  }

  async followingList(
    userId: number,
    targetId: number,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<FollowList[]> {
    const aggregate = this.followModel.aggregate<follow>();

    const cachedFollowingList = await this.followCacheService.get(
      targetId,
      'following',
    );

    if (cachedFollowingList.length) {
      console.log(`return cachedfollowingList`);

      console.log(`start cached checkFollowing: ${new Date().getTime()}`);
      const a = await this.checkFollowing({
        userId,
        cachedFollowList: cachedFollowingList,
      });

      console.log(`finish cached checkFollowing: ${new Date().getTime()}`);
      return a;
    }

    console.log(`dont have followingList cache`);
    console.log(`start non-cached checkFollowing: ${new Date().getTime()}`);

    if (filter) {
      aggregate.match(filter);
    }

    const following: Pick<follow, 'followId' | 'followAt'>[] =
      await this.findAllAndLean({
        filter: { userId: targetId },
        select: { _id: 0, followId: 1, followAt: 1 },
        sort: followSort(sortOrder),
      });

    const followingUserPreview = await Promise.all(
      following.map(async (following) => {
        const userFullProfile = await this.cursusUserCacheService
          .getUserFullProfile(following.followId)
          .then((user) => user?.cursusUser.user);

        if (!userFullProfile) {
          throw new NotFoundException();
        }

        const userPreview = {
          id: userFullProfile.id,
          login: userFullProfile.login,
          imgUrl: userFullProfile.image.link,
        };

        if (!userPreview) {
          throw new NotFoundException();
        }

        return { userPreview, followAt: following.followAt };
      }),
    );

    const followingList = await this.checkFollowing({
      userId,
      cachedFollowList: followingUserPreview,
    });

    console.log(`finish non-cached checkFollowing: ${new Date().getTime()}`);
    await this.followCacheService.set({
      id: targetId,
      type: 'following',
      list: followingList,
    });

    console.log(`finish setting cache: ${new Date().getTime()}`);
    return followingList;
  }

  async followingPaginated(
    userId: number,
    { pageNumber, pageSize, targetId, sortOrder }: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    const followList = await this.followingList(userId, targetId, sortOrder);

    return this.paginationIndexService.toPaginated<FollowList>(followList, {
      pageSize,
      pageNumber,
    });
  }

  async followerCount(
    followId: number,
    filter?: FilterQuery<follow>,
  ): Promise<number> {
    return await this.followModel.countDocuments({ followId, filter });
  }

  async followingCount(
    userId: number,
    filter?: FilterQuery<follow>,
  ): Promise<number> {
    return await this.followModel.countDocuments({ userId, filter });
  }

  async isFollowing(userId: number, followId: number): Promise<boolean> {
    return !!(await this.followModel.findOne({
      userId,
      followId,
    }));
  }

  async checkFollowing({
    userId,
    cachedFollowList,
  }: {
    userId: number;
    cachedFollowList: FollowListCacheType[];
  }): Promise<FollowList[]> {
    const followList = Promise.all(
      cachedFollowList.map(async (follow) => {
        const isFollowing = await this.isFollowing(
          userId,
          follow.userPreview.id,
        );

        return {
          isFollowing,
          followAt: follow.followAt,
          userPreview: follow.userPreview,
        };
      }),
    );

    return followList;
  }
}

const followSort = (sortOrder: FollowSortOrder): Record<string, SortOrder> => {
  switch (sortOrder) {
    case FollowSortOrder.FOLLOW_AT_ASC:
      return { _id: 'asc' };
    case FollowSortOrder.FOLLOW_AT_DESC:
      return { _id: 'desc' };
  }
};
