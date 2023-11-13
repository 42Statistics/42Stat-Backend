import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { Coalition } from 'src/page/common/models/coalition.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { ArrayDateRanged } from 'src/dateRange/models/dateRange.model';
import { IsOptional, Max, Min } from 'class-validator';

@ObjectType()
export class IntPerCoalition {
  @Field()
  coalition: Coalition;

  @Field()
  value: number;
}

@ObjectType()
export class IntPerCoalitionDateRanged extends ArrayDateRanged(
  IntPerCoalition,
) {}

@ObjectType()
export class ScoreRecordPerCoalition {
  @Field()
  coalition: Coalition;

  @Field((_type) => [IntRecord])
  records: IntRecord[];
}

@ObjectType()
export class HomeCoalition {
  @Field((_type) => [IntPerCoalition])
  totalScoresPerCoalition: IntPerCoalition[];

  @Field((_type) => [ScoreRecordPerCoalition])
  scoreRecordsPerCoalition: ScoreRecordPerCoalition[];

  @Field()
  tigCountPerCoalitionByDateTemplate: IntPerCoalitionDateRanged;
}

@ArgsType()
export class GetScoreRecordsPerCoalitionArgs {
  @Min(1)
  @Max(120)
  @IsOptional()
  @Field({ defaultValue: 12 })
  last: number;
}
