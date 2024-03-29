import { ArgsType, Field, Float, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ProjectPreview } from 'src/common/models/common.project.model';
import { IntRecord } from 'src/common/models/common.valueRecord.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';
import { TeamStatus } from 'src/page/teamInfo/models/teamInfo.status.model';
import { Character } from '../character/models/personal.general.character.model';
import {
  DailyActivity,
  DailyActivityDetailRecordUnion,
} from './personal.general.dailyActivity.model';
import { UserProfile } from './personal.general.userProfile.model';

@ObjectType()
export class UserTeam {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  occurrence: number;

  @Field()
  projectPreview: ProjectPreview;

  @Field((_type) => TeamStatus)
  status: TeamStatus;

  @Field()
  lastEventTime: Date;

  @Field({ nullable: true })
  isValidated?: boolean;

  @Field({ nullable: true })
  finalMark?: number;
}

@ObjectType()
export class PreferredTime {
  @Field()
  total: number;

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
export class PreferredTimeDateRanged extends DateRanged(PreferredTime) {}

@ObjectType()
export class PreferredCluster {
  @Field({ nullable: true })
  name?: string;
}

@ObjectType()
export class PreferredClusterDateRanged extends DateRanged(PreferredCluster) {}

@ObjectType()
export class UserTeamInfo {
  @Field({ nullable: true })
  lastRegistered?: UserTeam;

  @Field({ nullable: true })
  lastPassed?: UserTeam;

  @Field((_type) => [UserTeam])
  teams: UserTeam[];
}

@ObjectType()
export class LevelRecord {
  @Field()
  monthsPassed: number;

  @Field((_type) => Float)
  level: number;
}

@ObjectType()
export class UserScoreInfo {
  @Field()
  value: number;

  @Field({ nullable: true })
  rankInCoalition?: number;

  @Field({ deprecationReason: 'deprecated at v0.9.0' })
  rankInTotal: number;
}

@ArgsType()
export class GetLogtimeRecordsArgs {
  @Min(1)
  @Max(120)
  @Field()
  last: number;
}

export type PersonalGeneralRoot = Pick<
  PersonalGeneral,
  'userProfile' | 'beginAt' | 'blackholedAt' | 'wallet'
>;

@ObjectType()
export class PersonalGeneral {
  @Field()
  userProfile: UserProfile;

  @Field()
  beginAt: Date;

  @Field({ nullable: true })
  blackholedAt?: Date;

  @Field()
  wallet: number;

  @Field()
  scoreInfo: UserScoreInfo;

  @Field((_type) => [IntRecord])
  logtimeRecords: IntRecord[];

  @Field()
  preferredTimeByDateTemplate: PreferredTimeDateRanged;

  @Field()
  preferredClusterByDateTemplate: PreferredClusterDateRanged;

  @Field()
  teamInfo: UserTeamInfo;

  @Field((_type) => [LevelRecord])
  userLevelRecords: LevelRecord[];

  @Field((_type) => [LevelRecord])
  promoLevelRecords: LevelRecord[];

  @Field((_type) => [LevelRecord])
  promoMemberLevelRecords: LevelRecord[];

  @Field({ nullable: true })
  character?: Character;

  @Field((_type) => [DailyActivity])
  dailyActivities: DailyActivity[];

  @Field((_type) => [DailyActivityDetailRecordUnion])
  dailyActivityDetailRecords: (typeof DailyActivityDetailRecordUnion)[];
}
