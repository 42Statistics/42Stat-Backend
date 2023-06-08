import { Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/api/coalition/models/coalition.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';

@ObjectType()
export class IntPerCoalition {
  @Field()
  coalition: Coalition;

  @Field()
  value: number;
}

@ObjectType()
export class ScoreRecordPerCoalition {
  @Field()
  coalition: Coalition;

  @Field((_type) => [IntRecord], { nullable: 'items' })
  records: IntRecord[];
}

@ObjectType()
export class HomeCoalition {
  @Field((_type) => [IntPerCoalition])
  totalScoresPerCoalition: IntPerCoalition[];

  @Field((_type) => [ScoreRecordPerCoalition])
  scoreRecordsPerCoalition: ScoreRecordPerCoalition[];

  @Field((_type) => [IntPerCoalition])
  tigCountPerCoalition: IntPerCoalition[];
}
