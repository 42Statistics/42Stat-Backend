import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursorPaginated } from 'src/pagination/cursor/models/pagination.cursor.model';

@ObjectType()
export class FollowList {
  @Field({ nullable: true })
  isFollowing?: boolean;

  @Field()
  user: UserPreview;
}

@ObjectType()
export class FollowListPaginated extends CursorPaginated(FollowList) {}

@ObjectType()
export class FollowListWithCount {
  @Field((_type) => [FollowList])
  followList: FollowList[];

  @Field()
  count: number;
}

@ObjectType()
export class FollowFail {
  @Field()
  message: 'fail';
}

@ObjectType()
export class FollowSuccess {
  @Field()
  message: 'OK';

  @Field()
  userId: number;

  @Field()
  followId: number;
}

export const FollowResult = createUnionType({
  name: 'FollowResult',
  types: () => [FollowSuccess, FollowFail] as const,
  resolveType(value) {
    switch (value.message) {
      case 'OK':
        return FollowSuccess;
      case 'fail':
        return FollowFail;
    }
  },
});
