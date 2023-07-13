import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  clientId: string;

  @Field()
  credential: string;
}

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  google?: GoogleLoginInput;

  @Field({ nullable: true })
  ftCode?: string;
}
