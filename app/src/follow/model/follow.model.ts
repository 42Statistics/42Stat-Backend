import { Field, ObjectType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { IndexPaginated } from 'src/pagination/index/models/pagination.index.model';

@ObjectType()
export class FollowList {
  @Field({ nullable: true })
  isFollowing?: boolean;

  @Field()
  user: UserPreview;
}

@ObjectType()
export class FollowListPaginated extends IndexPaginated(FollowList) {}

@ObjectType()
export class FollowListWithCount {
  @Field((_type) => [FollowList])
  followList: FollowList[];

  @Field()
  count: number;
}

@ObjectType()
export class FollowSuccess {
  @Field()
  userId: number;

  @Field()
  followId: number;
}
