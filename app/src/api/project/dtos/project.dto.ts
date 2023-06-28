import { ArgsType, Field } from '@nestjs/graphql';
import { Min, MinLength } from 'class-validator';

@ArgsType()
export class projectSearchInput {
  @MinLength(2)
  @Field()
  name: string;

  @Min(1)
  @Field({ defaultValue: 10 })
  limit: number;
}
