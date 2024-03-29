import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TitlesUserDocument = HydratedDocument<titles_user>;

@Schema()
export class titles_user {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  titleId: number;

  @Prop({ required: true })
  selected: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TitlesUserSchema = SchemaFactory.createForClass(titles_user);
