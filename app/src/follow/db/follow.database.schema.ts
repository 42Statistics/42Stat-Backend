import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<follow>;

@Schema()
export class follow {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  followId: number;
}

export const FollowSchema = SchemaFactory.createForClass(follow);
