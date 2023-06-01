import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoalitionsUserDocument = HydratedDocument<coalitions_user>;

@Schema()
export class coalitions_user {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  coalitionId: number;

  @Prop()
  createdAt: Date;

  @Prop()
  rank: number;

  @Prop({ required: true })
  score: number;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  userId: number;
}

export const CoalitionsUserSchema =
  SchemaFactory.createForClass(coalitions_user);
