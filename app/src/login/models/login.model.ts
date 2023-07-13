import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class GoogleUser {
  @Field()
  googleId?: string;

  @Field()
  googleEmail?: string;

  @Field()
  linkedAt?: Date;
}

@ObjectType()
export class UserAccount extends GoogleUser {
  @Field()
  userId: number;
}

@ObjectType()
export class NotLinked {
  @Field()
  message: 'NotLinked';
}

@ObjectType()
export class Success {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  userId: number;

  @Field()
  message: 'OK';
}

export const LoginResult = createUnionType({
  name: 'LoginResult',
  types: () => [Success, NotLinked] as const,
  resolveType(value) {
    switch (value.message) {
      case 'OK':
        return Success;
      case 'NotLinked':
        return NotLinked;
    }
  },
});
