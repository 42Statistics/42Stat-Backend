import { ArgsType, Field } from '@nestjs/graphql';
import { Length, Max, Min } from 'class-validator';

// todo: deprecated at 0.7.0
@ArgsType()
export class GetSearchResultArgs {
  @Length(2, 100)
  @Field()
  input: string;

  @Min(1)
  @Max(50)
  @Field({ defaultValue: 10 })
  limit: number;
}

@ArgsType()
export class GetSpotlightArgs {
  @Length(2, 100)
  @Field()
  input: string;

  @Min(1)
  @Max(50)
  @Field({ defaultValue: 10 })
  limit: number;
}
