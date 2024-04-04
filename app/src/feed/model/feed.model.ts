import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserPreview } from 'src/common/models/common.user.model';
import { CursorPaginated } from 'src/pagination/cursor/models/pagination.cursor.model';
import { FeedType } from '../dto/feed.dto';

@ObjectType()
export class FeedBase {
  @Field()
  createdAt: Date;

  @Field((_type) => UserPreview)
  userPreview: UserPreview;
}

@ObjectType()
export class FollowFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.FOLLOW;

  @Field((_type) => UserPreview)
  followed: UserPreview;
}

@ObjectType()
export class LocationFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.LOCATION;

  @Field()
  location: string;
}

@ObjectType()
export class StatusMessageFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.STATUS_MESSAGE;

  @Field()
  message: string;
}

@ObjectType()
export class TeamStatusFinishedFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.TEAM_STATUS_FINISHED;

  @Field()
  teamInfo: string;
}

@ObjectType()
export class EventFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.EVENT;

  @Field()
  event: string;
}

@ObjectType()
export class NewMemberFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.NEW_MEMBER;

  @Field()
  memberAt: Date;
}

@ObjectType()
export class BlackholedAtFeed extends FeedBase {
  @Field((_type) => FeedType)
  type: FeedType.BLACKHOLED_AT;

  @Field()
  blackholedAt: Date;
}

export const feedUnion = createUnionType({
  name: 'FeedUnion',
  types: () => [
    FollowFeed,
    LocationFeed,
    StatusMessageFeed,
    TeamStatusFinishedFeed,
    EventFeed,
    NewMemberFeed,
    BlackholedAtFeed,
  ],
  resolveType: (value) => {
    if ('followed' in value) {
      return FollowFeed;
    }
    if ('location' in value) {
      return LocationFeed;
    }
    if ('message' in value) {
      return StatusMessageFeed;
    }
    if ('teamInfo' in value) {
      return TeamStatusFinishedFeed;
    }
    if ('event' in value) {
      return EventFeed;
    }
    if ('memberAt' in value) {
      return NewMemberFeed;
    }
    if ('blackholedAt' in value) {
      return BlackholedAtFeed;
    }
  },
}) as any; //todo: union을 pagination 하는 방법 찾기

@ObjectType()
export class FeedPaginated extends CursorPaginated(feedUnion) {}
