import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

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
export class SuccessType {
  @Field()
  status: 200;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  userId: number;
}

export const StatusUnion = createUnionType({
  name: 'StatusUnion',
  types: () =>
    [
      SuccessType,
      UnauthorizedType,
      NotFoundType,
      InternalServerErrorType,
    ] as const,
  resolveType(value) {
    switch (value.status) {
      case 200:
        return SuccessType;
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
