import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import {
  QueryArgs,
  QueryOneArgs,
  findAllAndLean,
  findOneAndLean,
} from 'src/database/mongoose/database.mongoose.query';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import { CursusUserService } from '../api/cursusUser/cursusUser.service';
import { follow } from './db/follow.database.schema';
import {
  FollowSortOrder,
  type FollowListPaginatedArgs,
} from './dto/follow.dto.getFollowList';
import type {
  FollowList,
  FollowListPaginated,
  FollowSuccess,
} from './model/follow.model';

type FollowListCursorField = [number, string];

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
    private readonly cursusUserService: CursusUserService,
    private readonly paginationIndexService: PaginationIndexService,
  ) {}

  async findOneAndLean(
    queryOneArgs?: QueryOneArgs<follow>,
  ): Promise<follow | null> {
    return await findOneAndLean(this.followModel, queryOneArgs);
  }

  async findAllAndLean(queryArgs?: QueryArgs<follow>): Promise<follow[]> {
    return await findAllAndLean(this.followModel, queryArgs);
  }

  async userIdByLogin(login: string): Promise<number> {
    const id = await this.cursusUserService.getuserIdByLogin(login);

    if (!id) {
      throw new NotFoundException();
    }

    return id;
  }

  async followUser(userId: number, target: string): Promise<FollowSuccess> {
    const following = await this.cursusUserService.getuserIdByLogin(target);

    const alreadyFollow = await this.followModel.findOne(
      {
        userId: userId,
        followId: following,
      },
      { _id: 1 },
    );

    if (!following || userId === following || alreadyFollow) {
      throw new NotFoundException();
    }

    const result = await this.followModel.create({
      userId: userId,
      followId: following,
      followAt: new Date(),
    });

    return {
      userId: result.userId,
      followId: result.followId,
    };
  }

  async unfollowUser(userId: number, target: string): Promise<FollowSuccess> {
    const following = await this.cursusUserService.getuserIdByLogin(target);

    if (!following || userId === following) {
      throw new NotFoundException();
    }

    const deletedCount = await this.followModel
      .deleteOne({
        userId: userId,
        followId: following,
      })
      .then((result) => result.deletedCount);

    if (deletedCount === 1) {
      return {
        userId: userId,
        followId: following,
      };
    }

    throw new NotFoundException();
  }

  async followerList(
    userId: number,
    target: string,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<FollowList[]> {
    const targetId = await this.userIdByLogin(target);

    const aggregate = this.followModel.aggregate<follow>();

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

    return await this.checkFollowing(userId, followerUserPreview);
  }

  async followerPaginated(
    userId: number,
    { pageNumber, pageSize, target, sortOrder }: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    const followList = await this.followerList(userId, target, sortOrder);

    return this.paginationIndexService.toPaginated<FollowList>(followList, {
      pageNumber,
      pageSize,
    });
  }

  async followingList(
    userId: number,
    target: string,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<FollowList[]> {
    const targetId = await this.userIdByLogin(target);

    const aggregate = this.followModel.aggregate<follow>();

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

    return await this.checkFollowing(userId, followingUserPreview);
  }

  async followingPaginated(
    userId: number,
    { pageNumber, pageSize, target, sortOrder }: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    const followList = await this.followingList(userId, target, sortOrder);

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

  async isFollowing(userId: number, targetId: number): Promise<boolean> {
    return !!(await this.followModel.findOne({
      userId,
      targetId,
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
