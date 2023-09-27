import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromosUserDocument = HydratedDocument<promos_user>;

@Schema()
export class promos_user {
  @Prop({ required: true })
  promo: number;

  @Prop({ required: true })
  userId: number;
}

export const promosUserSchema = SchemaFactory.createForClass(promos_user);
