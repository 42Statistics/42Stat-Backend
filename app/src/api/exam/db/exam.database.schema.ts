import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { project } from 'src/api/project/db/project.database.schema';

export type ExamDocument = HydratedDocument<exam>;

@Schema()
export class exam {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  beginAt: Date;

  // @Prop({ required: true })
  // campus: campusSchema,

  @Prop()
  createdAt: Date;

  // @Prop({ required: true })
  // cursus: z
  //   .object({
  //     id: z.number(),
  //     createdAt: z.coerce.date(),
  //     name: z.string(),
  //     slug: z.string(),
  //     kind: z.string(),
  //   })
  //   .array(),

  @Prop({ required: true })
  endAt: Date;

  @Prop({ required: true })
  ipRange: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  maxPeople?: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nbrSubscribers: number;

  @Prop({ required: true })
  projects: project[];

  @Prop()
  updatedAt: Date;
}

export const ExamSchema = SchemaFactory.createForClass(exam);
