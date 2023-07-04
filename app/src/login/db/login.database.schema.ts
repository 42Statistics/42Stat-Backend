import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoginDocument = HydratedDocument<login>;

@Schema({ versionKey: false })
export class login {
  @Prop()
  userId: number;

  @Prop()
  googleId?: string;

  @Prop()
  email?: string;

  @Prop()
  time?: Date;
}

export const LoginSchema = SchemaFactory.createForClass(login);
