import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserBase } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { ScaleTeamBase } from 'src/api/scaleTeam/db/scaleTeam.database.schema';

export type TeamDocument = HydratedDocument<team>;

// todo: cursus user 완성 후 고치기
@Schema()
export class TeamUser extends UserBase {
  @Prop({ required: true })
  leader: boolean;

  @Prop({ required: true })
  occurrence: number;

  @Prop({ required: true })
  validated: boolean;

  @Prop({ required: true })
  projectsUserId: number;
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
  createdAt: string; //todo: Date?

  @Prop()
  uploadId: number;
}

@Schema()
export class TeamBase {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  'closed?': boolean;

  @Prop({ required: true })
  closedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  finalMark?: number;

  @Prop({ required: true })
  'locked?': boolean;

  @Prop()
  lockedAt?: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  projectSessionId: number;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  users: TeamUser[];

  @Prop({ required: true, type: String })
  status:
    | 'creating_group'
    | 'finished'
    | 'in_progress'
    | 'waiting_for_correction';

  @Prop()
  terminatingAt?: Date;

  @Prop()
  'validated?'?: boolean;
}

@Schema()
export class team extends TeamBase {
  @Prop()
  scaleTeams: ScaleTeamBase[];

  @Prop()
  projectGitlabPath: string;

  @Prop()
  repoUrl: string;

  @Prop()
  repoUuid: string;

  @Prop()
  teamsUploads: TeamsUpload;
}

export const TeamSchema = SchemaFactory.createForClass(team);
