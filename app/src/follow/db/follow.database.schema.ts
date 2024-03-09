import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<follow>;

@Schema({ collection: 'temp_follows' })
export class follow {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  followId: number;

  @Prop({ required: true })
  followAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(follow);
