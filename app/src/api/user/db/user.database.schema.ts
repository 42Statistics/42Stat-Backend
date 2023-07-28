import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<user>;

@Schema()
export class Image {
  @Prop({ required: true })
  link?: string;
}

@Schema()
export class UserBase {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  login: string;

  @Prop()
  url: string;
}

@Schema()
export class user extends UserBase {
  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  usualFullName: string;

  @Prop()
  usualFirstName?: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  displayname: string;

  @Prop()
  kind: string;

  @Prop({ required: true })
  image: Image;

  @Prop({ required: true })
  'staff?': string;

  @Prop({ required: true })
  correctionPoint: number;

  @Prop()
  poolMonth: string;

  @Prop()
  poolYear: string;

  @Prop({ required: true })
  location?: string;

  @Prop({ required: true })
  wallet: number;

  @Prop()
  anonymizeDate: Date;

  @Prop()
  dataErasureDate: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  alumnizedAt?: Date;

  @Prop()
  'alumni?': boolean;

  @Prop()
  'active?': boolean;
}

export const UserSchema = SchemaFactory.createForClass(user);
