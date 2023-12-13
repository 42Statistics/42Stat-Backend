import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';

@ObjectType()
export class FollowListByMe {
  @Field()
  follow: boolean;

  @Field()
  user: UserPreview;
}

@ObjectType()
export class FollowUserList {
  @Field((_type) => [FollowListByMe])
  followUser: FollowListByMe[];

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
