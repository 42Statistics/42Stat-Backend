import { Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/api/coalition/models/coalition.model';
import { ValueRecord } from 'src/page/total/models/total.model';

//todo: change name
@ObjectType()
export class CoalitionPerValue {
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
