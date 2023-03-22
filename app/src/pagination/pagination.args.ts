import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 10 })
  first: number;

  @Field({ defaultValue: 0 })
  after: string;
}
