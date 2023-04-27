import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  ArrayDateRanged,
  DateRanged,
} from 'src/dateRange/models/dateRange.model';

// todo: erase this
@ObjectType()
export class TempTeam {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  occurrence: number;

  @Field({ nullable: true })
  closedAt?: Date;

  @Field()
  firstCreatedAt: Date;

  @Field({ nullable: true })
  finalMark?: number;

  @Field({
    nullable: true,
    description: 'true면 통과, false면 fail, null이면 미평가 입니다.',
  })
  isValidated?: boolean;
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
export class LogtimeInfoDateRanged extends DateRanged(LogtimeInfo) {}

@ObjectType()
export class TeamInfo {
  @Field({ nullable: true })
  lastRegistered?: string;

  @Field({ nullable: true })
  lastPass?: string;

  @Field((_type) => [TempTeam], { nullable: 'items' })
  teams: TempTeam[];
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
export class LevelGraphDateRanged extends ArrayDateRanged(LevelGraph) {}

@ObjectType()
// eslint-disable-next-line
export class PersonalGeneral {}
