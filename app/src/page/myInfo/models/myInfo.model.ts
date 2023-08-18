import { Field, ObjectType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { UserTeam } from 'src/page/personal/general/models/personal.general.model';

export type MyInfoRoot = {
  userPreview: UserPreview;
  displayname: string;
};

@ObjectType()
export class MyInfo {
  @Field()
  userPreview: UserPreview;

  @Field()
  displayname: string;

  @Field()
  isNewMember: boolean;

  @Field({ nullable: true })
  lastValidatedTeam?: UserTeam;

  @Field({ nullable: true })
  blackholedAt?: Date;

  @Field({ nullable: true })
  experienceRank?: number;

  @Field({ nullable: true })
  scoreRank?: number;

  @Field({ nullable: true })
  evalCountRank?: number;
}
