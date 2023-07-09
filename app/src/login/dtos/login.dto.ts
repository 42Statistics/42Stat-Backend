import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GoogleLoginInput {
  @Field()
  clientId: string;

  @Field()
  credential: string;
}

//todo: login to Login
@InputType()
export class loginInput {
  @Field({ nullable: true })
  google?: GoogleLoginInput;

  @Field({ nullable: true })
  code?: string;
}
