import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { FeedType } from '../dto/feed.dto';

@ObjectType()
export class Feed {
  @Field()
  id: number;

  @Field()
  userId: number;

  @Field()
  feedAt: Date;

  @Field((_type) => FeedType)
  type: FeedType;
}

@ObjectType()
export class FollowFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field((_type) => UserPreview)
  followed: UserPreview;
}

@ObjectType()
export class StatusMessageFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field()
  message: string;
}

@ObjectType()
export class EventFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field()
  event: string;
}

@ObjectType()
export class BlackholedAtFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field()
  blackholedAt: Date;
}

@ObjectType()
export class TeamStatusFinishedFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field()
  teamInfo: string;
}

@ObjectType()
export class NewMemberFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;
}

@ObjectType()
export class LocationFeed {
  @Field((_type) => FeedType)
  type: FeedType;

  @Field()
  id: number;

  @Field()
  at: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field()
  location: string;
}

export const FeedUnion = createUnionType({
  name: 'Feed',
  types: () =>
    [
      FollowFeed,
      StatusMessageFeed,
      EventFeed,
      BlackholedAtFeed,
      TeamStatusFinishedFeed,
      NewMemberFeed,
      LocationFeed,
    ] as const,
  resolveType: (
    value:
      | FollowFeed
      | StatusMessageFeed
      | EventFeed
      | BlackholedAtFeed
      | TeamStatusFinishedFeed
      | NewMemberFeed
      | LocationFeed,
  ) => {
    switch (value.type) {
      case FeedType.FOLLOW:
        return FollowFeed;
      case FeedType.STATUS_MESSAGE:
        return StatusMessageFeed;
      case FeedType.EVENT:
        return EventFeed;
      case FeedType.BLACKHOLED_AT:
        return BlackholedAtFeed;
      case FeedType.TEAM_STATUS_FINISHED:
        return TeamStatusFinishedFeed;
      case FeedType.NEW_MEMBER:
        return NewMemberFeed;
      case FeedType.LOCATION:
        return LocationFeed;
    }
  },
});
