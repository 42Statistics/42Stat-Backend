import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  clientId: string;

  @Field()
  credential: string;
}
