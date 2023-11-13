import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DailyUserEvalCountDocument =
  HydratedDocument<mv_daily_user_scale_team_counts>;

@Schema({ collection: 'mv_daily_user_scale_team_counts' })
export class mv_daily_user_scale_team_counts {
  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  userId: number;
}

export const dailyUserEvalCountSchema = SchemaFactory.createForClass(
  mv_daily_user_scale_team_counts,
);
