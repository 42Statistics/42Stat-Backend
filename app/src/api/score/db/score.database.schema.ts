import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScoreDocument = HydratedDocument<score>;

@Schema()
export class score {
  @Prop({ required: true })
  id: number;

  @Prop()
  calculationId?: number;

  @Prop({ required: true })
  coalitionId: number;

  @Prop()
  coalitionsUserId?: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  reason: string;

  @Prop()
  scoreable_id: number;

  @Prop()
  scoreable_type: string;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  value: number;
}

export const ScoreSchema = SchemaFactory.createForClass(score);
