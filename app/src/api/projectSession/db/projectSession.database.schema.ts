import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectSerssionsDocument = HydratedDocument<project_session>;

@Schema()
export class project_session {
  @Prop({ required: true })
  id: number;

  //...
}

export const ProjectSessionsSchema =
  SchemaFactory.createForClass(project_session);
