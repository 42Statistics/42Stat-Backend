import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<account>;

@Schema()
export class LinkedAccount {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  linkedAt: Date;

  @Prop()
  email?: string;
}

@Schema()
export class account {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  linkedAccounts: LinkedAccount[];
}

export const AccountSchema = SchemaFactory.createForClass(account);
