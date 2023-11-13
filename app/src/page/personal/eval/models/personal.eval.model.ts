import { ArgsType, Field, Float, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { UserRank } from 'src/common/models/common.user.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
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

  @Field((_type) => [IntRecord])
  countRecords: IntRecord[];

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

  @Field((_types) => [UserRank])
  destinyRanking: UserRank[];

  @Field({ nullable: true })
  recentComment?: string;
}

@ArgsType()
export class GetPersonalEvalCountRecordsArgs {
  @Min(1)
  @Max(120)
  @Field({ description: '1 ~ 120 개월' })
  last: number;
}
