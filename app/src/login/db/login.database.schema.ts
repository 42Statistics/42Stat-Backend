import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoginDocument = HydratedDocument<login>;

@Schema({ versionKey: false })
export class login {
  @Prop()
  ftUid: number;

  @Prop()
  googleId?: string;
}

export const LoginSchema = SchemaFactory.createForClass(login);
