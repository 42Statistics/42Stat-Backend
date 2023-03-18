import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphInterval } from './graph.interval';

@ObjectType()
export class CountByPeriod {
  @Field()
  startDate: Date;

  @Field((_type) => GraphInterval)
  interval: GraphInterval;

  @Field((_type) => [Int], { nullable: 'items' })
  counts: number[];
}
