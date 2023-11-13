import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { IntRecord } from 'src/common/models/common.valueRecord.model';

@ObjectType()
export class HomeEval {
  @Field()
  totalEvalCount: number;

  @Field((_type) => [IntRecord])
  evalCountRecords: IntRecord[];

  @Field()
  averageFeedbackLength: number;

  @Field()
  averageCommentLength: number;
}

@ArgsType()
export class GetEvalCountRecordsArgs {
  @Min(1)
  @Max(730)
  @Field()
  last: number;
}
