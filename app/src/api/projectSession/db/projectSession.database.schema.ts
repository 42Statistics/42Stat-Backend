import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectSerssionDocument = HydratedDocument<project_session>;

@Schema()
export class project_session {
  @Prop({ required: true })
  id: number;

  //...
}

export const ProjectSessionSchema =
  SchemaFactory.createForClass(project_session);
