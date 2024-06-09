import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActiveUserCountDocument = HydratedDocument<mv_active_user_counts>;

@Schema({ collection: 'mv_active_user_counts' })
export class mv_active_user_counts {
  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  date: Date;
}

export const activeUserCountSchema = SchemaFactory.createForClass(
  mv_active_user_counts,
);
