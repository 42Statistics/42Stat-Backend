import { Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/api/coalition/models/coalition.model';
import { ValueRecord } from '../../models/home.model';

@ObjectType()
export class ValuePerCoalition {
  @Field()
  coalition: Coalition;

  @Field()
  value: number;
}

@ObjectType()
export class ScoreRecordPerCoalition {
  @Field()
  coalition: Coalition;

  @Field((_type) => [ValueRecord], { nullable: 'items' })
  records: ValueRecord[];
}

@ObjectType()
export class HomeCoalition {
  @Field((_type) => [ValuePerCoalition])
  totalScoresPerCoalition: ValuePerCoalition[];

  @Field((_type) => [ScoreRecordPerCoalition])
  scoreRecordsPerCoalition: ScoreRecordPerCoalition[];

  @Field((_type) => [ValuePerCoalition])
  tigCountPerCoalitions: ValuePerCoalition[];
}
