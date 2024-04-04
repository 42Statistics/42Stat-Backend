import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserPreview } from 'src/common/models/common.user.model';
import { FeedType } from '../dto/feed.dto';

/** feed */

export type FeedDocument = HydratedDocument<feed>;
@Schema({ collection: 'feeds', discriminatorKey: 'kind' })
export class feed {
  @Prop({ type: String, required: true, enum: Object.values(FeedType) })
  type: FeedType;
}

export const FeedSchema = SchemaFactory.createForClass(feed);

/** follow feed */

export type FollowFeedDocument = HydratedDocument<followFeed>;

@Schema({ collection: 'feeds' })
export class followFeed extends feed {
  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, type: UserPreview })
  userPreview: UserPreview;

  @Prop({ required: true, type: UserPreview })
  followed: UserPreview;
}

export const FollowFeedSchema = SchemaFactory.createForClass(followFeed);

/** location feed */

export type LocationFeedDocument = HydratedDocument<followFeed>;

@Schema({ collection: 'feeds' })
export class locationFeed extends feed {
  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, type: UserPreview })
  userPreview: UserPreview;

  @Prop({ required: true })
  location: string;
}

export const LocationFeedSchema = SchemaFactory.createForClass(locationFeed);
