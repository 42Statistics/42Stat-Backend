import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginUser {
  @Field()
  sub: string;
}
