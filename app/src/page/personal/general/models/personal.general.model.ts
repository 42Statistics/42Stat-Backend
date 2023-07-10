import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/api/project/models/project.preview';
import { IntDateRanged } from 'src/common/models/common.dateRanaged.model';
import { Rate } from 'src/common/models/common.rate.model';
import { UserRank } from 'src/common/models/common.user.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';
import { UserProfile } from './personal.general.userProfile.model';

export enum TeamStatus {
  REGISTERED,
  IN_PROGRESS,
  WAITING_FOR_CORRECTION,
  FINISHED,
}

registerEnumType(TeamStatus, { name: 'TeamStatus' });

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
  @Field((_type) => String, { nullable: true })
  name: string | null;
}

@ObjectType()
export class PreferredClusterDateRanged extends DateRanged(PreferredCluster) {}

@ObjectType()
export class TeamInfo {
  @Field({ nullable: true })
  lastRegistered?: string;

  @Field({ nullable: true })
  lastPassed?: string;

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

  @Field()
  rankInTotal: number;
}

@ObjectType()
export class UserRankWithCount extends UserRank {
  @Field()
  totalUserCount: number;
}

@ObjectType()
export class CharacterEffort {
  @Field()
  logtimeRank: UserRankWithCount;

  @Field()
  evalCountRank: UserRankWithCount;

  @Field()
  examTryCount: number;

  @Field()
  projectTryCount: number;
}

@ObjectType()
export class CharacterTalent {
  @Field()
  levelRank: UserRankWithCount;

  @Field()
  examOneshotRate: Rate;

  @Field()
  projectOneshotRate: Rate;

  @Field()
  outstandingRate: Rate;
}

@ObjectType()
export class Character {
  @Field()
  effort: CharacterEffort;

  @Field()
  talent: CharacterTalent;
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

  @Field()
  logtimeByDateTemplate: IntDateRanged;

  @Field()
  preferredTimeByDateTemplate: PreferredTimeDateRanged;

  @Field()
  preferredClusterByDateTemplate: PreferredClusterDateRanged;

  @Field()
  teamInfo: TeamInfo;

  @Field((_type) => [LevelRecord])
  userLevelRecords: LevelRecord[];

  @Field((_type) => [LevelRecord])
  promoLevelRecords: LevelRecord[];

  @Field((_type) => [LevelRecord])
  promoMemberLevelRecords: LevelRecord[];

  @Field({ nullable: true })
  character: Character;
}
