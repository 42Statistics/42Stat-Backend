import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromoDocument = HydratedDocument<promo>;

@Schema()
export class promo {
  @Prop({ required: true })
  promo: number;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true })
  userCount: number;
}

export const promoSchema = SchemaFactory.createForClass(promo);
