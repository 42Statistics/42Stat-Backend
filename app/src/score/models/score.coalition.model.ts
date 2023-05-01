import { Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/coalition/models/coalition.model';
import { ValueRecord } from 'src/total/models/total.model';

@ObjectType()
export class CoalitionScore {
  @Field()
  coalition: Coalition;

  @Field()
  value: number;
}

@ObjectType()
export class CoalitionScoreRecords {
  @Field()
  coalition: Coalition;

  @Field((_type) => [ValueRecord], { nullable: 'items' })
  records: ValueRecord[];
}
