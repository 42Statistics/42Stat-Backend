import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeedDocument = HydratedDocument<feed>;

@Schema({ collection: 'feeds' })
export class feed {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const FeedSchema = SchemaFactory.createForClass(feed);
