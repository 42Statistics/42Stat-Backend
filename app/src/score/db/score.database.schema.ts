import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScoreDocument = HydratedDocument<score>;

@Schema()
export class score {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  coalitionId: number;

  // scoreable_id: z.number(),
  // scoreable_type: z.string(),

  @Prop({ required: false })
  coalitionsUserId?: number;

  @Prop({ required: false })
  calculationId?: number;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const ScoreSchema = SchemaFactory.createForClass(score);
