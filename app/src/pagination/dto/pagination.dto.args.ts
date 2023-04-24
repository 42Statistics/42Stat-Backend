import { ArgsType, Field } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field({ defaultValue: 10 })
  @Max(100)
  @Min(1)
  pageSize: number;

  @Field({ defaultValue: 1 })
  @Max(999999999)
  @Min(1)
  pageNumber: number;
}
