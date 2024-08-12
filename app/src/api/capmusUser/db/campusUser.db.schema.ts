import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CampusUserDocument = HydratedDocument<campus_user>;

@Schema()
export class campus_user {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  campusId: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  isPrimary: boolean;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  userId: number;
}

export const CampusUserSchema = SchemaFactory.createForClass(campus_user);
