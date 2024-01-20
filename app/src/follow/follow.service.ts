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
    const alreadyFollow = await this.followModel.findOne(
      {
        userId,
        followId: targetId,
      },
      { _id: 1 },
    );

    if (userId === targetId || alreadyFollow) {
      throw new NotFoundException();
    }

    return {
      userId,
      followId: targetId,
    };
  }

  async unfollowUser(userId: number, targetId: number): Promise<FollowSuccess> {
    if (!targetId || userId === targetId) {
      throw new NotFoundException();
    }

    const deletedCount = await this.followModel
      .deleteOne({
        userId,
        followId: targetId,
      })
      .then((result) => result.deletedCount);

    if (deletedCount === 1) {
      return {
        userId,
        followId: targetId,
      };
    }

    throw new NotFoundException();
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

    if (cachedFollowerList) {
      console.log(`return cachedFollowerList`);
      return cachedFollowerList;
    }

    console.log(`dont have followerList cache`);

    if (filter) {
      aggregate.match(filter);
    }

    const follower: Pick<follow, 'userId'>[] = await this.findAllAndLean({
      filter: { followId: targetId },
      select: { _id: 0, userId: 1 },
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

        return userPreview;
      }),
    );

    const followerList = await this.checkFollowing(userId, followerUserPreview);

    await this.followCacheService.set({
      id: targetId,
      type: 'follower',
      list: followerList,
    });

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

    if (cachedFollowingList) {
      console.log(`return cachedfollowingList`);
      return cachedFollowingList;
    }

    console.log(`dont have followingList cache`);

    if (filter) {
      aggregate.match(filter);
    }

    const following: Pick<follow, 'followId'>[] = await this.findAllAndLean({
      filter: { userId: targetId },
      select: { _id: 0, followId: 1 },
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

        return userPreview;
      }),
    );

    const followingList = await this.checkFollowing(
      userId,
      followingUserPreview,
    );

    await this.followCacheService.set({
      id: targetId,
      type: 'following',
      list: followingList,
    });

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

  async checkFollowing(
    userId: number,
    userPreview: UserPreview[],
  ): Promise<FollowList[]> {
    const followList = userPreview.map(async (user) => {
      const isFollowing = await this.isFollowing(userId, user.id);

      return { isFollowing, user };
    });

    return await Promise.all(followList);
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
