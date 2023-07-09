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
  linkedTime?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  login: string;

  @Prop()
  displayname: string;

  @Prop()
  imgUrl: string;
}

//todo: google과 user로 나눌지 -> nullable 관리 편함 & userId가 2번 들어갈 수 있음

export const AccountSchema = SchemaFactory.createForClass(account);
