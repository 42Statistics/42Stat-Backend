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
  googleEmail?: string;

  @Prop()
  linkedTime?: Date;
}

export const LoginSchema = SchemaFactory.createForClass(login);
