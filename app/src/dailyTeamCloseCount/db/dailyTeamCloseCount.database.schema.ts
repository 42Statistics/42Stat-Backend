import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type DailyTeamCloseCountDocument =
  HydratedDocument<mv_daily_team_close_counts>;

@Schema({ collection: 'mv_daily_team_close_counts' })
export class mv_daily_team_close_counts {
  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  date: Date;
}

export const dailyTeamCloseCountSchema = SchemaFactory.createForClass(
  mv_daily_team_close_counts,
);
