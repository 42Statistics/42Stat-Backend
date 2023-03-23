import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { UserPreview } from 'src/personalEval/models/personal.eval.info.model';

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

  @Field({ nullable: true })
  finalMark: number;

  @Field({
    nullable: true,
    description: 'true면 통과, false면 fail, null이면 미평가 입니다.',
  })
  isValidated: boolean | null;
}

@ObjectType()
export class PreferredTime {
  @Field()
  morning: number;

  @Field()
  dayTime: number;

  @Field()
  evening: number;

  @Field()
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
  lastRegisterd: string | null;

  @Field((_type) => String, { nullable: true })
  lastPassed: string | null;

  @Field((_type) => [TempTeam], { nullable: 'items' })
  teams: TempTeam[];
}

// @ObjectType()
// export class  {}

@ObjectType()
export class DestinyUser extends UserPreview {
  @Field()
  score: number;
}

@ObjectType()
export class LevelHisotry {
  @Field()
  date: Date;

  @Field((_type) => Float)
  level: number;
}

@ObjectType()
export class PersonalGeneral {
  @Field()
  totalEvalCnt: number;

  @Field()
  evalDifficulty: number; // todo

  @Field((_type) => [DestinyUser])
  destinyUsers: DestinyUser[];

  @Field()
  logtimeInfo: LogtimeInfo;

  @Field()
  teamInfo: TeamInfo;

  @Field((_type) => [LevelHisotry])
  levelHistory: LevelHisotry[];
}
