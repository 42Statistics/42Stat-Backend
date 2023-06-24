import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/api/cursusUser/db/cursusUser.database.schema';
import { ProjectBase } from 'src/api/project/db/project.database.schema';
import { team } from 'src/api/team/db/team.database.schema';

export type ProjectsUserDocument = HydratedDocument<projects_user>;

@Schema()
export class projects_user {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  currentTeamId: number;

  @Prop({ required: true })
  finalMark?: number;

  @Prop({ required: true })
  markedAt?: Date;

  @Prop({ required: true })
  occurrence: number;

  @Prop({ required: true })
  project: ProjectBase;

  @Prop({ required: true })
  retriableAt?: Date;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  teams: team[];

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  user: User;

  @Prop({ required: true })
  'validated?'?: boolean;
}
export const ProjectsUserSchema = SchemaFactory.createForClass(projects_user);
