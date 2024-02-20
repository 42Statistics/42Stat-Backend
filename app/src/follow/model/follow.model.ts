import { Field, ObjectType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { IndexPaginated } from 'src/pagination/index/models/pagination.index.model';

@ObjectType()
export class MyFollow {
  @Field()
  isFollowing: boolean;

  @Field()
  userPreview: UserPreview;

  @Field()
  followAt: Date;
}

export type Follow = Omit<MyFollow, 'isFollowing'>;

@ObjectType()
export class MyFollowPaginated extends IndexPaginated(MyFollow) {}

@ObjectType()
export class FollowSuccess {
  @Field()
  userId: number;

  @Field()
  followId: number;
}
