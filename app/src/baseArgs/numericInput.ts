import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NumericInput {
  @Field({ nullable: true })
  start?: number;

  @Field({ nullable: true })
  end?: number;
}
