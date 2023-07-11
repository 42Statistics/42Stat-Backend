import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<account>;

@Schema({ versionKey: false })
export class account {
  @Prop()
  userId: number;

  @Prop()
  googleId?: string;

  @Prop()
  googleEmail?: string;

  @Prop()
  linkedAt?: Date;

  @Prop()
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(account);
