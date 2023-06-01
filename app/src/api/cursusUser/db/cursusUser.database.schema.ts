import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<cursus_user>;
export type CursusUserDatable = 'beginAt' | 'blackholedAt';

@Schema()
export class Skills {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  level: number;
}

@Schema()
export class Cursus {
  @Prop()
  id: number;

  @Prop()
  createdAt: Date;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  kind: string;
}

@Schema()
export class Image {
  @Prop({ required: true })
  link: string;
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
export class User extends UserBase {
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

@Schema()
export class cursus_user {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true })
  blackholedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  cursus: Cursus;

  @Prop()
  cursusId: number;

  @Prop()
  endAt?: Date;

  @Prop({ required: true })
  grade?: string;

  @Prop()
  hasCoalition: boolean;

  @Prop({ required: true })
  level: number;

  // @Prop({ type: [{ type: mongoose.Schema.Types.Array, ref: 'Skills' }] })
  @Prop()
  skills: Skills[];

  @Prop()
  updatedAt: Date;

  @Prop({ type: User })
  user: User;
}

export const CursusUserSchema = SchemaFactory.createForClass(cursus_user);
