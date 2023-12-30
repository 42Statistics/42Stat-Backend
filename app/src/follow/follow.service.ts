import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import {
  QueryArgs,
  findAllAndLean,
} from 'src/database/mongoose/database.mongoose.query';
import {
  CursorExtractor,
  FieldExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { CursusUserService } from '../api/cursusUser/cursusUser.service';
import { follow } from './db/follow.database.schema';
import {
  FollowSortOrder,
  type FollowListPaginatedArgs,
} from './dto/follow.dto.getFollowList';
import type {
  FollowList,
  FollowListPaginated,
  FollowResult,
} from './model/follow.model';

type FollowListCursorField = [number, string];

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
    private readonly cursusUserService: CursusUserService,
    private readonly paginationCursorService: PaginationCursorService,
  ) {}

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

  async followUser(
    userId: number,
    target: string,
  ): Promise<typeof FollowResult> {
    const following = await this.cursusUserService.getuserIdByLogin(target);

    const alreadyFollow = await this.followModel.find({
      userId: userId,
      followId: following,
    });

    if (!following || userId === following || alreadyFollow.length) {
      return { message: 'fail' };
    }

    const result = await this.followModel
      .create({ userId: userId, followId: following, followAt: new Date() })
      .then((result) => result.toObject());

    return {
      message: 'OK',
      userId: result.userId,
      followId: result.followId,
    };
  }

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
  async followerList(
    userId: number,
    target: string,
    limit: number,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<FollowList[]> {
    const targetId = await this.userIdByLogin(target);

    const aggregate = this.followModel.aggregate<follow>();

    if (filter) {
      aggregate.match(filter);
    }

    const follower = await aggregate
      .match({ followId: targetId })
      .sort(followSort(sortOrder))
      .limit(limit);

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

    return await this.checkFollowingStatus(userId, followerUserPreview);
  }

  async followerPaginated(
    userId: number,
    { after, first, target, sortOrder }: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    const targetId = await this.userIdByLogin(target);

    const totalCount = await this.followerCount(targetId);

    const aggregate = this.followModel.aggregate<follow>();
    const filter: FilterQuery<follow> = {};

    if (after) {
      const [id, _login]: FollowListCursorField =
        this.paginationCursorService.toFields(after, fieldExtractor);

      const [followAt] = await aggregate.match({
        userId: id,
        followId: targetId,
      });

      if (!followAt) {
        return this.generateEmptyPage();
      }

      switch (sortOrder) {
        case FollowSortOrder.FOLLOW_AT_ASC:
          filter.$or = [{ followAt: { $gt: followAt.followAt } }];
          break;
        case FollowSortOrder.FOLLOW_AT_DESC:
          filter.$or = [{ followAt: { $lt: followAt.followAt } }];
          break;
      }
    }

    const followList = await this.followerList(
      userId,
      target,
      first + 1,
      sortOrder,
      filter,
    );

    return this.paginationCursorService.toPaginated<FollowList>(
      followList.slice(0, first),
      totalCount,
      followList.length > first,
      cursorExtractor,
    );
  }

  async followingList(
    userId: number,
    target: string,
    limit: number,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<FollowList[]> {
    const targetId = await this.userIdByLogin(target);

    const aggregate = this.followModel.aggregate<follow>();

    if (filter) {
      aggregate.match(filter);
    }

    const following = await aggregate
      .match({ userId: targetId })
      .sort(followSort(sortOrder))
      .limit(limit);

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

    return await this.checkFollowingStatus(userId, followingUserPreview);
  }

  async followingPaginated(
    userId: number,
    { after, first, target, sortOrder }: FollowListPaginatedArgs,
  ): Promise<FollowListPaginated> {
    const targetId = await this.userIdByLogin(target);

    const totalCount = await this.followingCount(targetId);

    const aggregate = this.followModel.aggregate<follow>();
    const filter: FilterQuery<follow> = {};

    if (after) {
      const [id, _login]: FollowListCursorField =
        this.paginationCursorService.toFields(after, fieldExtractor);

      const [followAt] = await aggregate.match({
        userId: targetId,
        followId: id,
      });

      if (!followAt) {
        return this.generateEmptyPage();
      }

      switch (sortOrder) {
        case FollowSortOrder.FOLLOW_AT_ASC:
          filter.$or = [{ followAt: { $gt: followAt.followAt } }];
          break;
        case FollowSortOrder.FOLLOW_AT_DESC:
          filter.$or = [{ followAt: { $lt: followAt.followAt } }];
          break;
      }
    }

    const followList = await this.followingList(
      userId,
      target,
      first + 1,
      sortOrder,
      filter,
    );

    return this.paginationCursorService.toPaginated<FollowList>(
      followList.slice(0, first),
      totalCount,
      followList.length > first,
      cursorExtractor,
    );
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

  async followStatus(
    userId: number,
    target: string,
  ): Promise<boolean | undefined> {
    const followId = await this.userIdByLogin(target);

    let isFollowing: boolean | undefined = undefined;

    await this.followModel.findOne({
      userId,
      followId,
    });

    return isFollowing;
  }

  async checkFollowingStatus(
    userId: number,
    userPreview: UserPreview[],
  ): Promise<FollowList[]> {
    const followList = userPreview.map(async (user) => {
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

    return await Promise.all(followList);
  }

  private generateEmptyPage(): FollowListPaginated {
    return this.paginationCursorService.toPaginated<FollowList>(
      [],
      0,
      false,
      cursorExtractor,
    );
  }
}

const cursorExtractor: CursorExtractor<FollowList> = (doc) =>
  doc.user.id.toString() + '_' + doc.user.login.toString();

const fieldExtractor: FieldExtractor<FollowListCursorField> = (
  cursor: string,
) => {
  const [idString, loginString] = cursor.split('_');

  return [parseInt(idString), loginString];
};

const followSort = (sortOrder: FollowSortOrder): Record<string, SortOrder> => {
  switch (sortOrder) {
    case FollowSortOrder.FOLLOW_AT_ASC:
      return { _id: 'asc' };
    case FollowSortOrder.FOLLOW_AT_DESC:
      return { _id: 'desc' };
  }
};
