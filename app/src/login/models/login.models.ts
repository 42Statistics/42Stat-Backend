import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
  @Field()
  ftUid: number;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}

@ObjectType()
export class ValidateResult {
  @Field()
  message: string;

  @Field()
  errorCode: number;
}
