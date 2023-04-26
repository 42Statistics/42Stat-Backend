import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoalitionDocument = HydratedDocument<coalition>;

@Schema()
export class coalition {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  image_url?: string;

  @Prop()
  cover_url?: string;

  @Prop()
  color?: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  user_id: number;
}

export const CoalitionSchema = SchemaFactory.createForClass(coalition);
