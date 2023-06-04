import { Field, Float, ObjectType } from '@nestjs/graphql';
import { DateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class IntDateRanged extends DateRanged(Number) {}

@ObjectType()
export class FloatDateRanged {
  @Field((_type) => Float)
  data: number;

  @Field()
  start: Date;

  @Field()
  end: Date;
}

@ObjectType()
export class StringDateRanged extends DateRanged(String) {}
