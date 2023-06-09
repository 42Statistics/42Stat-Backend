import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { UserProfile } from 'src/page/personal/general/models/personal.general.userProfile.model';

// @ObjectType()
// export class DestinyUser extends UserPreview {
//   @Field()
//   score: number;
// }

export type PersonalEvalRoot = Pick<
  PersonalEval,
  'userProfile' | 'correctionPoint'
>;

@ObjectType()
export class PersonalEval {
  @Field((_type) => UserProfile)
  userProfile: UserProfile;

  @Field()
  correctionPoint: number;

  @Field()
  totalCount: number;

  @Field()
  countByDateTemplate: IntDateRanged;

  @Field()
  totalDuration: number;

  @Field()
  averageDuration: number;

  @Field((_type) => Float)
  averageFinalMark: number;

  @Field()
  averageFeedbackLength: number;

  @Field()
  averageCommentLength: number;

  // @Field((_types) => [DestinyUser], { nullable: 'items' })
  // destinyUsers: DestinyUser[];

  @Field()
  latestFeedback: string;

  @Field()
  evalLogSearchUrl: string;
}
