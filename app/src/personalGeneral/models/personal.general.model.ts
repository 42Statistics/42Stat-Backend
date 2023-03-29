import { Field, Float, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { UserProfile } from './personal.general.userProfile.model';

// todo: erase this
@ObjectType()
export class TempTeam {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  occurrence: number;

  @Field((_type) => Date, { nullable: true })
  closedAt: Date | null;

  @Field()
  firstCreatedAt: Date;

  @Field((_type) => Int, { nullable: true })
  finalMark: number | null;

  @Field((_type) => Boolean, {
    nullable: true,
    description: 'true면 통과, false면 fail, null이면 미평가 입니다.',
  })
  isValidated: boolean | null;
}

@ObjectType()
export class PreferredTime {
  @Field({ description: '06 ~ 12' })
  morning: number;

  @Field({ description: '12 ~ 18' })
  daytime: number;

  @Field({ description: '18 ~ 24' })
  evening: number;

  @Field({ description: '24 ~ 06' })
  night: number;
}

@ObjectType()
export class LogtimeInfo {
  @Field()
  currMonthLogtime: number;

  @Field()
  lastMonthLogtime: number;

  @Field()
  preferredTime: PreferredTime;

  @Field()
  preferredCluster: string;
}

@ObjectType()
export class TeamInfo {
  @Field((_type) => String, { nullable: true })
  lastRegistered: string | null;

  @Field((_type) => String, { nullable: true })
  lastPass: string | null;

  @Field((_type) => [TempTeam], { nullable: 'items' })
  teams: TempTeam[];
}

export enum EvalUserDifficulty {
  EASY,
  MEDIUM,
  HARD,
  HELL,
}

registerEnumType(EvalUserDifficulty, {
  name: 'EvalUserDifficulty',
});

@ObjectType()
export class DestinyUser extends UserPreview {
  @Field()
  score: number;
}

@ObjectType()
export class EvalUserInfo {
  @Field()
  totalEvalCnt: number;

  @Field((_type) => EvalUserDifficulty)
  difficulty: EvalUserDifficulty;

  @Field((_types) => [DestinyUser], { nullable: 'items' })
  destinyUsers: DestinyUser[];
}

@ObjectType()
export class LevelGraph {
  @Field()
  date: Date;

  @Field((_type) => Float)
  userLevel: number;

  @Field((_type) => Float)
  averageLevel: number;
}

@ObjectType()
export class PersonalGeneral {
  @Field()
  evalUserInfo: EvalUserInfo;

  @Field()
  logtimeInfo: LogtimeInfo;

  @Field()
  teamInfo: TeamInfo;

  @Field((_type) => [LevelGraph])
  levelGraphs: LevelGraph[];

  @Field()
  userProfile: UserProfile;
}
