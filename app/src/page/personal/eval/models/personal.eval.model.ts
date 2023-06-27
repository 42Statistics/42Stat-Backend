import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { UserRank } from 'src/common/models/common.user.model';
import { UserProfile } from 'src/page/personal/general/models/personal.general.userProfile.model';

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

  @Field((_types) => [UserRank], { nullable: 'items' })
  destinyRanking: UserRank[];

  @Field({ nullable: true })
  recentComment?: string;
}
