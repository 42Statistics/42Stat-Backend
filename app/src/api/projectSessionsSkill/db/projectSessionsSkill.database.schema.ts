import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectSessionsSkillDocument =
  HydratedDocument<project_sessions_skill>;

@Schema()
export class project_sessions_skill {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  projectSessionId: number;

  @Prop({ required: true })
  skillId: number;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  value: number;
}

export const ProjectSessionsSkillSchema = SchemaFactory.createForClass(
  project_sessions_skill,
);
