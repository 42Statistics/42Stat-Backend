import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoginUserDocument = HydratedDocument<login_user>;

@Schema()
export class login_user {
  @Prop()
  sub?: string;

  @Prop()
  ftId?: number;
}

export const LoginUserSchema = SchemaFactory.createForClass(login_user);
