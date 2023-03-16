import { ArgsType, Field } from '@nestjs/graphql';

// todo: module 만들어야하나?
@ArgsType()
export class PaginationArgs {
  @Field()
  offset: number = 0;

  @Field()
  limit: number = 10;
}
