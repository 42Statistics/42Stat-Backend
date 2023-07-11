import { Field, ObjectType } from '@nestjs/graphql';

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
export class Token {
  @Field()
  userId: number;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
