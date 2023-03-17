import { ArgsType, Field } from '@nestjs/graphql';

// todo: module 만들어야하나?
@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 10 })
  first: number;

  @Field({ defaultValue: 0 })
  after: string;
}
