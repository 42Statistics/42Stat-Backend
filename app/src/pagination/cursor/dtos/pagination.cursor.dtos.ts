import { ArgsType, Field } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationCursorArgs {
  @Field({ nullable: true })
  after?: string;

  @Field()
  @Min(1)
  @Max(100)
  first: number;
}
