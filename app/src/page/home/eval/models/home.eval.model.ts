import { Field, ObjectType } from '@nestjs/graphql';
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
