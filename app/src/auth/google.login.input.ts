import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  clientId: string;

  @Field()
  credential: string;
}
