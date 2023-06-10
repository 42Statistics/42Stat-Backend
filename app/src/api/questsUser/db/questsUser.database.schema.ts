import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/api/cursusUser/db/cursusUser.database.schema';

export type QuestsUserDocument = HydratedDocument<quests_user>;

@Schema()
export class Quest {
  @Prop({ required: true })
  id: number;

  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop()
  kind: string;

  @Prop()
  internalName: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  description: string;

  @Prop()
  cursusId: number;

  @Prop()
  campusId?: number;

  @Prop()
  gradeId: number;

  @Prop()
  position: number;
}

@Schema()
export class quests_user {
  @Prop({ required: true })
  id: number;

  @Prop()
  advancement?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  endAt?: Date;

  @Prop()
  prct?: number;

  @Prop({ required: true })
  quest: Quest;

  @Prop({ required: true })
  questId: number;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  user: User;

  @Prop({ required: true })
  validatedAt?: Date;
}

export const QuestsUserSchema = SchemaFactory.createForClass(quests_user);
