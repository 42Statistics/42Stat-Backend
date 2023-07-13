import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<account>;

@Schema()
export class account {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  googleId?: string;

  @Prop({ required: true })
  googleEmail?: string;

  @Prop({ required: true })
  linkedAt?: Date;
}

export const AccountSchema = SchemaFactory.createForClass(account);
