import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoalitionsUserDocument = HydratedDocument<coalitions_user>;

@Schema()
export class coalitions_user {
  @Prop()
  id: number;

  @Prop()
  coalitionId: number;

  @Prop()
  userId: number;

  @Prop()
  score: number;

  @Prop()
  rank: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CoalitionsUserSchema =
  SchemaFactory.createForClass(coalitions_user);
