import { Field, ObjectType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { IndexPaginated } from 'src/pagination/index/models/pagination.index.model';

@ObjectType()
export class FollowList {
  @Field()
  isFollowing: boolean;

  @Field()
  userPreview: UserPreview;

  @Field()
  followAt: Date;
}

export type FollowListCacheType = Omit<FollowList, 'isFollowing'>;

@ObjectType()
export class FollowListPaginated extends IndexPaginated(FollowList) {}

@ObjectType()
export class FollowSuccess {
  @Field()
  userId: number;

  @Field()
  followId: number;
}
