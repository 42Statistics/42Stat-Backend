import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ collection: 'events_users' })
export class events_users {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  eventId: number;

  @Prop({ required: true })
  userId: number;
}
