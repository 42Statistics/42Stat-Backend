import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class LinkedAccount {
  @Field()
  platform: string;

  @Field()
  id: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  linkedAt: Date;
}

@ObjectType()
export class Account {
  @Field()
  userId: number;

  @Field((_type) => [LinkedAccount])
  linkedAccount: LinkedAccount[];
}

@ObjectType()
export class LoginNotLinked {
  @Field()
  message: 'NotLinked';
}

@ObjectType()
export class LoginSuccess {
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
  types: () => [LoginSuccess, LoginNotLinked] as const,
  resolveType(value) {
    switch (value.message) {
      case 'OK':
        return LoginSuccess;
      case 'NotLinked':
        return LoginNotLinked;
    }
  },
});
