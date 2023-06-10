import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { Cursus } from 'src/api/cursusUser/db/cursusUser.database.schema';

export type LevelDocument = HydratedDocument<level>;

@Schema()
export class level {
  @Prop()
  id: number;

  @Prop({ required: true })
  lvl: number;

  @Prop({ required: true })
  xp: number;

  @Prop()
  cursus: Cursus;

  @Prop()
  cursusId: number;

  @Prop()
  createdAt: Date;
}

export const LevelSchema = SchemaFactory.createForClass(level);
