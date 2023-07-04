import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  @Field()
  userId: number;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class ValidateResult {
  @Field()
  message: string;

  @Field()
  errorCode: number;
}

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
export class ErrorType {
  /**
   * google login only: 401
   * token not found: 404
   * token 만료 : 401
   * input 없음: 404
   */
  @Field()
  status: number;

  @Field()
  message: string;
}

@ObjectType()
export class SuccessType {
  @Field()
  status: number;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  userId: number;
}

export const StatusType = createUnionType({
  name: 'StatusType',
  types: () => [ErrorType, SuccessType] as const,
  resolveType(value) {
    if ('message' in value) {
      return ErrorType;
    } else if (
      'accessToken' in value &&
      'refreshToken' in value &&
      'userId' in value
    ) {
      return SuccessType;
    }
    return undefined;
  },
});
