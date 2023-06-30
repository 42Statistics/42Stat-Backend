import { ArgsType, Field } from '@nestjs/graphql';
import { Length, Max, Min } from 'class-validator';

@ArgsType()
export class userSearchInput {
  @Length(2, 10)
  @Field()
  login: string;

  @Min(1)
  @Max(50)
  @Field({ defaultValue: 10 })
  limit: number;
}
