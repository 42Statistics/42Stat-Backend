import { Field, Float, ObjectType } from '@nestjs/graphql';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { UserProfile } from 'src/page/personalGeneral/models/personal.general.userProfile.model';

// export enum EvalUserDifficulty {
//   EASY,
//   MEDIUM,
//   HARD,
//   HELL,
// }

// registerEnumType(EvalUserDifficulty, {
//   name: 'EvalUserDifficulty',
// });

// @ObjectType()
// export class DestinyUser extends UserPreview {
//   @Field()
//   score: number;
// }

@ObjectType()
export class PersonalEval {
  @Field()
  currMonthCount: NumberDateRanged;

  @Field()
  lastMonthCount: NumberDateRanged;

  @Field()
  totalCount: number;

  @Field()
  averageDuration: number;

  @Field((_type) => Float, {
    description: '평가자 기준으로 준 평균 점수 입니다.',
  })
  averageFinalMark: number;

  @Field({ description: '피평가자가 작성한 리뷰의 평균 길이 입니다.' })
  averageFeedbackLength: number;

  @Field({ description: '평가자가 작성한 리뷰의 평균 길이 입니다.' })
  averageCommentLength: number;

  @Field((_type) => UserProfile)
  userProfile: UserProfile;

  //   @Field((_type) => EvalUserDifficulty)
  // difficulty: EvalUserDifficulty;

  // @Field((_types) => [DestinyUser], { nullable: 'items' })
  // destinyUsers: DestinyUser[];
}
