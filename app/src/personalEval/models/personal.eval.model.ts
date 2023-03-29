import { Field, Float, ObjectType } from '@nestjs/graphql';
import { UserProfile } from 'src/personalGeneral/models/personal.general.userProfile.model';

@ObjectType()
export class EvalProfile {
  @Field()
  currMonthCnt: number;

  @Field()
  lastMonthCnt: number;

  @Field()
  averageDuration: number;

  @Field((_type) => Float, {
    description: '평가자 기준으로 준 평균 점수 입니다.',
  })
  averageFinalMark: number;

  @Field({ description: '평가자, 피평가자 모두 포함해서 계산된 값 입니다.' })
  averageFeedbackLength: number;
}

@ObjectType()
export class PersonalEval {
  @Field()
  evalProfile: EvalProfile;

  @Field()
  userProfile: UserProfile;
}
