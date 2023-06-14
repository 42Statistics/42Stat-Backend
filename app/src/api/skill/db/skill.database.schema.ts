import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SkillDocument = HydratedDocument<skill>;

@Schema()
export class skill {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;
}

export const SkillSchema = SchemaFactory.createForClass(skill);
