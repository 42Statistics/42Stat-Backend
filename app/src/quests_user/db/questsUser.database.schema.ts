import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestsUserDocument = HydratedDocument<quests_user>;

//export interface User {}

export interface Quest {
  id: number;
  //name: string;
  slug: string;
  //kind: string;
  //created_at: Date;
  //updated_at: Date;
}

@Schema()
export class quests_user {
  @Prop({ required: true })
  id: number;

  //@Prop()
  //end_at?: Date;

  //@Prop()
  //quest_id: number;

  //@Prop()
  //validated_at?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true, type: Object })
  quest: Quest;

  //@Prop({ type: Object })
  //user: User;
}

export const QuestsUserSchema = SchemaFactory.createForClass(quests_user);
