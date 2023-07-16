import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<account>;

@Schema()
export class LinkedAccount {
  @Prop({ required: true })
  linkedPlatform: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  linkedAt: Date;

  @Prop({ required: true })
  email?: string;
}

@Schema()
export class account {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  linkedAccount: LinkedAccount[];
}

export const AccountSchema = SchemaFactory.createForClass(account);
