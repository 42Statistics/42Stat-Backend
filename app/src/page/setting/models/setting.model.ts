import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/login/models/login.model';

@ObjectType()
export class Setting {
  @Field()
  account: Account;
}
