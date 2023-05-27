import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ScaleTeamBase } from 'src/api/scaleTeam/db/scaleTeam.database.schema';

export type TeamDocument = HydratedDocument<team>;

@Schema()
export class TeamBase {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  finalMark?: number;

  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  status: string;

  @Prop()
  terminatingAt?: Date;

  @Prop({ required: true })
  'locked?': boolean;

  @Prop()
  'validated?'?: boolean;

  @Prop({ required: true })
  'closed?': boolean;

  @Prop()
  lockedAt?: Date;

  @Prop()
  closedAt?: Date;

  @Prop({ required: true })
  projectSessionId: number;
}

@Schema()
export class team extends TeamBase {
  @Prop({ required: true })
  scaleTeams: ScaleTeamBase[];
}

export const TeamSchema = SchemaFactory.createForClass(team);
