import { Field, ObjectType, PickType, createUnionType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { UserProfile } from 'src/page/personal/general/models/personal.general.userProfile.model';

@ObjectType()
export class GoogleUser {
  @Field()
  googleId: string;

  @Field()
  email?: string;

  @Field()
  time: Date;
}

@ObjectType()
export class InternalServerErrorType {
  @Field()
  status: 500;

  @Field()
  message: string;
}

@ObjectType()
export class BadRequestType {
  @Field()
  status: 400;

  @Field()
  message: string;
}

@ObjectType()
export class UnauthorizedType {
  @Field()
  status: 401;

  @Field()
  message: string;
}

@ObjectType()
export class NotFoundType {
  @Field()
  status: 404;

  @Field()
  message: string;
}

@ObjectType()
export class UserPreviewWithDisplayname extends PickType(UserProfile, [
  'id',
  'login',
  'imgUrl',
  'displayname',
]) {}

@ObjectType()
export class SuccessType {
  @Field()
  status: 200;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  userPreview: UserPreviewWithDisplayname;
}

export const StatusUnion = createUnionType({
  name: 'StatusUnion',
  types: () =>
    [
      SuccessType,
      BadRequestType,
      UnauthorizedType,
      NotFoundType,
      InternalServerErrorType,
    ] as const,
  resolveType(value) {
    switch (value.status) {
      case 200:
        return SuccessType;
      case 400:
        return BadRequestType;
      case 401:
        return UnauthorizedType;
      case 404:
        return NotFoundType;
      case 500:
        return InternalServerErrorType;
      default:
        return undefined;
    }
  },
});
