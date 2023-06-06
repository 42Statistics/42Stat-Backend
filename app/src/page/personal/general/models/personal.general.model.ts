import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  IntDateRanged,
  StringDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateRanged } from 'src/dateRange/models/dateRange.model';
import {
  UserProfile,
  UserScoreRank,
} from './personal.general.userProfile.model';

@ObjectType()
export class TempTeam {
  @Field()
  id: number;

  @Field()
  teamName: string;

  @Field() //todo: projectId 를 통해 구하기
  projectName: string;

  @Field()
  occurrence: number;

  @Field()
  finalMark?: number;

  @Field({ description: '레지스터' })
  createdAt: Date;

  @Field({ description: '팀 빌딩' })
  lockedAt?: Date;

  @Field({ description: '제출' })
  closedAt?: Date;

  @Field()
  isValidated?: boolean;

  @Field({ description: '평가완료날' }) //todo: teamsUploads.createdAt
  finishedAt?: Date;

  @Field({ description: '상태: 팀빌딩, 진행중, 평가중, 완료' })
  status: string;
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
export class TeamInfo {
  @Field({ nullable: true })
  lastRegistered?: string;

  @Field({ nullable: true })
  lastPass?: string;

  @Field((_type) => [TempTeam], { nullable: 'items' })
  teams: TempTeam[];
}

@ObjectType()
export class LevelRecord {
  @Field()
  after: number;

  @Field((_type) => Float)
  userLevel: number;

  @Field((_type) => Float)
  averageLevel: number;
}

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
  scoreInfo: UserScoreRank;

  @Field()
  logtimeByDateTemplate: IntDateRanged;

  @Field()
  preferredTimeByDateTemplate: PreferredTimeDateRanged;

  @Field()
  preferredClusterByDateTemplate: StringDateRanged;

  @Field()
  teamInfo: TeamInfo;

  @Field((_type) => [LevelRecord])
  levelRecords: LevelRecord[];
}
