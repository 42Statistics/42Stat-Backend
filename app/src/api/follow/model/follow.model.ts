import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';

@ObjectType()
export class UserList {
  @Field()
  user: UserPreview[];

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

export const LoginResult = createUnionType({
  name: 'LoginResult',
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
