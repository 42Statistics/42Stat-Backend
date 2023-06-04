import { Field, ObjectType } from '@nestjs/graphql';
import {
  FloatDateRanged,
  IntDateRanged,
} from 'src/common/models/common.dateRanaged.model';

@ObjectType()
export class HomeEval {
  @Field()
  totalEvalCount: number;

  @Field()
  evalCountByDateTemplate: IntDateRanged;

  @Field()
  averageEvalCountByDateTemplate: FloatDateRanged;

  @Field()
  averageFeedbackLength: number;

  @Field()
  averageCommentLength: number;
}
