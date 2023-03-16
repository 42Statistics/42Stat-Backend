import { ArgsType, Field } from '@nestjs/graphql';

// todo: module 만들어야하나?
@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 0 })
  offset: number;

  @Field({ defaultValue: 10 })
  limit: number;
}
