import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { ProjectPreview } from 'src/common/models/common.project.model';
import { EvalLog, EvalLogHeader } from 'src/page/evalLog/models/evalLog.model';
import { TeamInfoBase } from './teamInfo.base.model';
import { TeamStatus } from './teamInfo.status.model';
import { UserPreview } from 'src/common/models/common.user.model';

@ObjectType()
export class TeamUpload {
  @Field()
  id: number;

  @Field()
  finalMark: number;

  @Field()
  comment: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class TeamEvalLogHeader extends OmitType(EvalLogHeader, [
  'teamPreview',
  'projectPreview',
]) {}

@ObjectType()
export class TeamEvalLog extends OmitType(EvalLog, ['header']) {
  @Field((_type) => TeamEvalLogHeader)
  header: Omit<EvalLogHeader, 'teamPreview' | 'projectPreview'>;
}

@ObjectType()
export class TeamInfo extends TeamInfoBase {
  @Field((_type) => [UserPreview])
  users: UserPreview[];

  @Field({ nullable: true, description: '기계 채점 결과' })
  moulinette?: TeamUpload;

  @Field((_type) => TeamStatus)
  status: TeamStatus;

  @Field({ nullable: true })
  lockedAt?: Date;

  @Field({ nullable: true })
  closedAt?: Date;

  @Field()
  projectPreview: ProjectPreview;

  @Field((_type) => [TeamEvalLog])
  evalLogs: TeamEvalLog[];
}
