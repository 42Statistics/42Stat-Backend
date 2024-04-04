import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import { FeedType } from '../dto/feed.dto';

export type FeedDocument = HydratedDocument<feed>;

@Schema({ collection: 'feeds', discriminatorKey: 'type' })
export class feed {
  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, type: UserPreview })
  userPreview: UserPreview;

  @Prop({ required: true, type: String, enum: Object.values(FeedType) })
  type: FeedType;

  @Prop({ type: UserPreview })
  followed?: UserPreview;

  @Prop({ type: String })
  location?: string;
}

export const FeedSchema = SchemaFactory.createForClass(feed);
