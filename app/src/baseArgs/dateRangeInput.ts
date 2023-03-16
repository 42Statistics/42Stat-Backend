import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DateRangeInput {
  @Field({ nullable: true })
  start?: Date;

  @Field({ nullable: true })
  end?: Date;
}
