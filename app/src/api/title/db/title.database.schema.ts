import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TitleDocument = HydratedDocument<title>;

@Schema()
export class title {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;
}

export const TitleSchema = SchemaFactory.createForClass(title);
