import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProjectBase } from 'src/api/project/db/project.database.schema';

export type ExpereinceDocument = HydratedDocument<experience_user>;

@Schema()
export class experience_user {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  cursusId: number;

  @Prop()
  project: ProjectBase;
}

export const ExperienceSchema = SchemaFactory.createForClass(experience_user);
