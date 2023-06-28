import { ArgsType, Field } from '@nestjs/graphql';
import { Min, MinLength } from 'class-validator';

@ArgsType()
export class userSearchInput {
  @MinLength(2)
  @Field()
  login: string;

  @Min(1)
  @Field({ defaultValue: 10 })
  limit: number;
}
