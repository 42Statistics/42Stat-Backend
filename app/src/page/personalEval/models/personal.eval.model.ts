import { Field, Float, ObjectType } from '@nestjs/graphql';
import { NumberDateRanged } from 'src/common/models/common.number.dateRanaged';
import { UserProfile } from 'src/page/personalGeneral/models/personal.general.userProfile.model';

// @ObjectType()
// export class DestinyUser extends UserPreview {
//   @Field()
//   score: number;
// }

@ObjectType()
export class PersonalEval {
  @Field((_type) => UserProfile)
  userProfile: UserProfile;

  @Field({ description: '보유 평가 포인트' })
  correctionPoint: number;

  @Field({ description: '월간 평가 횟수 (이번달 + 저번달)' })
  currMonthCount: NumberDateRanged;

  @Field({ description: '월간 평가 횟수 (이번달 + 저번달)' })
  lastMonthCount: NumberDateRanged;

  @Field({ description: '누적 평가 횟수' })
  totalCount: number;

  @Field({ description: '누적 평가 시간' })
  totalDuration: number;

  @Field({ description: '평균 평가 시간' })
  averageDuration: number;

  @Field((_type) => Float, { description: '평균 평가 점수' })
  averageFinalMark: number;

  @Field({ description: '평균 피드백 길이' })
  averageFeedbackLength: number;

  @Field({ description: '평균 코멘트 길이' })
  averageCommentLength: number;

  // @Field((_types) => [DestinyUser], { nullable: 'items' })
  // destinyUsers: DestinyUser[];

  @Field({ description: '최근 받은 피드백' })
  latestFeedback: string;

  @Field({ description: '이 유저의 이전 평가가 궁금하다면?' })
  evalLogSearchLink: string;
}
