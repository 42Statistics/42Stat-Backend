import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  ArrayDateRanged,
  DateRanged,
} from 'src/dateRange/models/dateRange.model';
import {
  NumberDateRanged,
  StringDateRanged,
} from 'src/common/models/common.number.dateRanaged';
import { UserProfile } from './personal.general.userProfile.model';

// todo: erase this
@ObjectType()
export class TempTeam {
  @Field()
  id: number;

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
export class PreferredTimeDateRanged extends DateRanged(PreferredTime) {}

@ObjectType()
export class PersonalGeneral {
  @Field()
  currMonthLogtime: NumberDateRanged;

  @Field()
  lastMonthLogtime: NumberDateRanged;

  @Field()
  preferredTime: PreferredTimeDateRanged;

  @Field()
  preferredCluster: StringDateRanged;

  @Field()
  teamInfo: TeamInfo;

  @Field()
  levelGraphs: LevelGraphDateRanged;

  @Field()
  userProfile: UserProfile;

  @Field()
  levelRank: number;
}
