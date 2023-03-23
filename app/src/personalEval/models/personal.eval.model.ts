import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EvalStatSummary {
  @Field()
  currMonthEvalCnt: number;

  @Field()
  lastMonthEvalCnt: number;

  @Field()
  averageEvalDuration: number;

  @Field((_type) => Float, {
    description: '평가자 기준으로 준 평균 점수 입니다.',
  })
  averageFinalMark: number;

  @Field({ description: '평가자, 피평가자 모두 포함해서 계산된 값 입니다.' })
  averageFeedbackLength: number;
}

@ObjectType()
export class PersonalEval {
  @Field((_type) => EvalStatSummary)
  evalStatSummary: EvalStatSummary;
}
