import { Field, ObjectType } from '@nestjs/graphql';
import { CountByPeriod } from 'src/graph/countByPeriod.model';

@ObjectType()
export class ScaleTeamGraph {
  @Field({ description: '인자에 맞는 평가의 총 개수를 반환합니다.' })
  totalCount: number;

  @Field({
    description: '평가자의 comment, 피평가자의 feedback을 모두 포함합니다.',
  })
  averageFeedbackLength: number;

  @Field((_type) => CountByPeriod, {
    description: '기간 별 평가의 개수를 배열로 반환합니다.',
  })
  countByPeriod: CountByPeriod;
}

/*
eval count per week

*/
