import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<token>;

@Schema({ versionKey: false })
export class token {
  @Prop()
  userId: number;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(token);
