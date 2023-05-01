import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<cursus_user>;
export type CursusUserDatable = 'beginAt' | 'blackholedAt';

@Schema()
export class Cursus {
  @Prop({ required: true })
  id: number;
  //createdAt: Date;
  //name: string;
  //slug: string;
  //kind: string;
}

@Schema()
export class Image {
  @Prop({ required: true })
  link: string;
}

@Schema()
export class User {
  @Prop({ required: true })
  id: number;
  //email: string;
  @Prop({ required: true })
  login: string;
  //firstName: string;
  //lastName: string;
  //usualFullName: string;
  //usualFirstName?: string;
  //url: string;
  //phone: string;
  @Prop({ required: true })
  displayname: string;
  //kind: string;
  @Prop({ required: true })
  image: Image;
  //versions: {
  //  large: string;
  //  medium: string;
  //  small: string;
  //  micro: string;
  //};
  @Prop({ required: true })
  'staff?': string;
  @Prop({ required: true })
  correctionPoint: number;
  //@Prop({ required: true })
  //poolMonth: string;
  //@Prop({ required: true })
  //poolYear: string;
  //@Prop({ required: true })
  //location?: string;
  @Prop({ required: true })
  wallet: number;
  //anonymizeDate: Date;
  //dataErasureDate: Date;
  //createdAt: Date;
  //updatedAt: Date;
  //alumnizedAt?: Date;
  //alumni?: Date;
  @Prop({ required: true })
  'active?': boolean;
}

@Schema()
export class cursus_user {
  @Prop({ required: true })
  grade?: string;

  @Prop({ required: true })
  level: number;

  //@Prop({ required: true })
  //skills: Skills;

  //@Prop({ required: true })
  //blackholedAt?: Date;

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true })
  endAt?: Date;

  @Prop()
  cursusId: number;

  @Prop()
  hasCoalition: boolean;

  //@Prop()
  //createdAt: Date;

  //@Prop()
  //updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  cursus: Cursus;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  user: User;
}

export const CursusUserSchema = SchemaFactory.createForClass(cursus_user);
