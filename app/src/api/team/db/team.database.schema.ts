import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Flag,
  ScaleTeamBase,
} from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import { UserBase } from 'src/api/user/db/user.database.schema';
import { TeamBase } from './team.database.base.schema';

export type TeamDocument = HydratedDocument<team>;

@Schema()
export class TeamScaleTeam
  implements Omit<ScaleTeamBase, 'feedbacks' | 'scale'>
{
  @Prop()
  id: number;

  @Prop()
  scaleId: number;

  @Prop()
  createdAt: Date;

  @Prop()
  finalMark?: number;

  @Prop()
  updatedAt: Date;

  @Prop()
  comment?: string;

  @Prop()
  beginAt: Date;

  @Prop()
  correcteds: UserBase[];

  @Prop()
  corrector: UserBase;

  @Prop()
  feedback?: string;

  @Prop()
  filledAt?: Date;

  @Prop()
  flag: Flag;
}

@Schema()
export class TeamsUpload {
  @Prop()
  id: number;

  @Prop()
  finalMark: number;

  @Prop()
  comment: string;

  @Prop()
  createdAt: Date;

  @Prop()
  uploadId: number;
}

@Schema()
export class team extends TeamBase {
  @Prop()
  scaleTeams: TeamScaleTeam[];

  @Prop()
  projectGitlabPath: string;

  @Prop()
  repoUrl: string;

  @Prop()
  repoUuid: string;

  @Prop()
  teamsUploads: TeamsUpload[];
}

export const TeamSchema = SchemaFactory.createForClass(team);
