import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/cursus_user/db/cursusUser.database.schema';
export type UserDocument = HydratedDocument<quests_user>;

@Schema()
export class Quest {
  @Prop({ required: true })
  id: number;

  //@Prop({ required: true })
  //name: string;

  //@Prop({ required: true })
  //slug: string;

  //@Prop({ required: true })
  //kind: string;

  //@Prop({ required: true })
  //createdAt: Date;

  //@Prop({ required: true })
  //updatedAt: Date;

  //@Prop({ required: true })
  //firstName: string;

  //@Prop({ required: true })
  //lastName: string;

  //@Prop({ required: true })
  //usualFullName: string;

  //@Prop({ required: true })
  //poolMonth: string;

  //@Prop({ required: true })
  //poolYear: string;

  //@Prop({ required: true })
  //anonymizeDate: Date;

  //@Prop({ required: true })
  //dataErasureDate: Date;

  //@Prop({ required: true })
  //alumnizedAt?: Date;
}

@Schema()
export class quests_user {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  quest: Quest;

  @Prop({ required: true })
  user: User;

  //@Prop({ required: true })
  //endAt?: Date;

  @Prop({ required: true })
  questId: number;

  @Prop({ required: true })
  validatedAt: Date;

  //@Prop({ required: true })
  //createdAt: Date;

  //@Prop({ required: true })
  //updatedAt: Date;
}

export const QuestsUserSchema = SchemaFactory.createForClass(quests_user);
