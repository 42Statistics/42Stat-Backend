import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type DailyCoalitionScoreDocument =
  HydratedDocument<mv_daily_score_values>;

@Schema({ collection: 'mv_daily_score_values' })
export class mv_daily_score_values {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  coalitionId: number;

  @Prop({ required: true })
  value: number;
}

export const dailyCoalitionScoreSchema = SchemaFactory.createForClass(
  mv_daily_score_values,
);
