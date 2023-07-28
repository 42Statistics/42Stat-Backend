import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { user } from 'src/api/user/db/user.database.schema';

export type CursusUserDocument = HydratedDocument<cursus_user>;

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

  @Prop()
  user: user;
}

export const CursusUserSchema = SchemaFactory.createForClass(cursus_user);
