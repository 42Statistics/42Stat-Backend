import { Field, Float, ObjectType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { UserTeam } from 'src/page/personal/general/models/personal.general.model';

type SeoulStudentInfo = {
  userPreview: UserPreview;
  displayname: string;
  level: number;
  beginAt: Date;
};

type SeoulUserInfo = {
  userPreview: UserPreview;
  displayname: string;
  level?: number;
  beginAt?: Date;
};

export type MyInfoRoot = SeoulStudentInfo | SeoulUserInfo;

@ObjectType()
export class MyRecentActivity {
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

@ObjectType()
export class MyInfo {
  @Field()
  userPreview: UserPreview;

  @Field()
  displayname: string;

  @Field((_type) => Float, { nullable: true })
  level?: number;

  @Field({ nullable: true })
  beginAt?: Date;

  @Field({ nullable: true })
  myRecentActivity?: MyRecentActivity;

  @Field({
    deprecationReason: 'deprecated at v0.9.0, recentActivity 를 사용하세요',
  })
  isNewMember: boolean;

  @Field({
    nullable: true,
    deprecationReason: 'deprecated at v0.9.0, recentActivity 를 사용하세요',
  })
  lastValidatedTeam?: UserTeam;

  @Field({
    nullable: true,
    deprecationReason: 'deprecated at v0.9.0, recentActivity 를 사용하세요',
  })
  blackholedAt?: Date;

  @Field({
    nullable: true,
    deprecationReason: 'deprecated at v0.9.0, recentActivity 를 사용하세요',
  })
  experienceRank?: number;

  @Field({
    nullable: true,
    deprecationReason: 'deprecated at v0.9.0, recentActivity 를 사용하세요',
  })
  scoreRank?: number;

  @Field({
    nullable: true,
    deprecationReason: 'deprecated at v0.9.0, recentActivity 를 사용하세요',
  })
  evalCountRank?: number;
}
