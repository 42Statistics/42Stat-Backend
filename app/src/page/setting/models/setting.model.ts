import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Account {
  @Field()
  login: string;

  @Field({ nullable: true })
  googleEmail?: string;

  @Field({ nullable: true })
  linkedAt?: Date;
}

@ObjectType()
export class Setting {
  @Field()
  account: Account;
}
