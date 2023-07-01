import { ArgsType, Field } from '@nestjs/graphql';
import { Length, Max, Min } from 'class-validator';

@ArgsType()
export class projectSearchInput {
  @Length(2, 100)
  @Field()
  name: string;

  @Min(1)
  @Max(50)
  @Field({ defaultValue: 10 })
  limit: number;
}
