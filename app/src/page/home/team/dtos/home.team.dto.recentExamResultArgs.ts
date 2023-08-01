import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class RecentExamResultArgs {
  @Min(0)
  @Field({ defaultValue: 0 })
  after: number;
}
