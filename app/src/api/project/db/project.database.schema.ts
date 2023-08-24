import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<project>;

@Schema()
export class ProjectBase {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;
}

// todo: 현재는 project base 기준, 추후 확장시 더 가져와야 함.
@Schema()
export class project extends ProjectBase {
  @Prop()
  difficulty?: number;

  // parent: z
  //   .object({
  //     name: z.string(),
  //     id: z.number(),
  //     slug: z.string(),
  //     url: z.string(),
  //   })
  //   .nullable(),
  // children: [],
  // attachments: [],

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  exam: boolean;

  @Prop()
  circle?: number;

  @Prop()
  pdfUrl?: string;

  // git_id: z.number().nullable(),
  // repository: z.string().nullable(),
}

export const ProjectSchema = SchemaFactory.createForClass(project);
