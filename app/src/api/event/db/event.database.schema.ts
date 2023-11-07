import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type eventDocument = HydratedDocument<events>;

@Schema({ collection: 'events' })
export class events {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;
}

export const eventSchema = SchemaFactory.createForClass(events);
