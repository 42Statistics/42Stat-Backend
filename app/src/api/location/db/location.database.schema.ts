import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { user } from 'src/api/user/db/user.database.schema';

export type LocationDocument = HydratedDocument<location>;

@Schema()
export class location {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  beginAt: Date;

  @Prop({ required: true })
  campusId: number;

  @Prop({ required: true })
  endAt?: Date;

  @Prop({ required: true })
  host: string;

  @Prop({ required: true })
  primary: boolean;

  @Prop({ required: true })
  user: user;
}

export const LocationSchema = SchemaFactory.createForClass(location);
