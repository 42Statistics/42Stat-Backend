import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type DailyLogtimeDocument = HydratedDocument<daily_logtimes>;

@Schema({ collection: 'daily_logtimes' })
export class daily_logtimes {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  value: number;
}

export const dailyLogtimeSchema = SchemaFactory.createForClass(daily_logtimes);
