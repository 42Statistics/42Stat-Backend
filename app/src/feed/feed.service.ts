import { Injectable } from '@nestjs/common';
import { FollowCacheService } from 'src/follow/follow.cache.service';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';
import {
  CursorExtractor,
  PaginationCursorService,
} from 'src/pagination/cursor/pagination.cursor.service';
import { FeedType } from './dto/feed.dto';
import {
  BlackholedAtFeed,
  EventFeed,
  FeedPaginated,
  FeedUnion,
  FollowFeed,
  LocationFeed,
  NewMemberFeed,
  StatusMessageFeed,
  TeamStatusFinishedFeed,
} from './model/feed.model';

@Injectable()
export class FeedService {
  constructor(
    private readonly followCacheService: FollowCacheService,
    private readonly paginationCursorService: PaginationCursorService,
  ) {}

  async getFeedPaginated({
    userId,
    args,
  }: {
    userId: number;
    args: PaginationCursorArgs;
  }): Promise<FeedPaginated> {
    //pagination을 위해 함수 분리
    //id만 가진 db를 만들어 매번 로컬피드캐시에서 join하기 <- 캐시작업때 고려
    const followFeeds = await this.getFollowFeeds(userId);
    const locationFeeds = await this.getLocationFeeds(userId);
    const statusMessageFeeds = await this.getStatusMessageFeeds(userId);
    const teamStatusFinishedFeeds = await this.getTeamStatusFinishedFeeds(
      userId,
    );
    const eventFeeds = await this.getEventFeeds(userId);
    const newMemberFeeds = await this.getNewMemberFeeds(userId);
    const blackholedAtFeeds = await this.getBlackholedAtFeeds(userId);

    const feeds: (typeof FeedUnion)[] = [
      ...followFeeds,
      ...locationFeeds,
      ...statusMessageFeeds,
      ...teamStatusFinishedFeeds,
      ...eventFeeds,
      ...newMemberFeeds,
      ...blackholedAtFeeds,
    ];

    if (!feeds.length) {
      return this.generateEmptyFeed();
    }

    //sort로 정렬 (최신순 고정)
    feeds.sort((a, b) => b.at.getTime() - a.at.getTime());

    //pagination
    if (args.after) {
      const afterIndex = feeds.findIndex(
        (feed) => cursorExtractor(feed) === args.after,
      );
      feeds.splice(0, afterIndex + 1);
    }

    return this.paginationCursorService.toPaginated(
      feeds.slice(0, args.first),
      feeds.length,
      feeds.length > args.first,
      cursorExtractor,
    );
  }

  //userId의 피드에 뜰 정보
  async getFollowFeeds(userId: number): Promise<FollowFeed[]> {
    //userId가 팔로우 한 사람들
    const followingList = await this.followCacheService.get(
      userId,
      'following',
    );

    const followFeeds: FollowFeed[] = [];

    //followingList가 팔로우한 사람들
    followingList.map(async (follow) => {
      const followersFollowing = await this.followCacheService.filterByDate(
        follow.userPreview.id,
        'following',
        follow.followAt,
      );

      followFeeds.push(
        ...followersFollowing.map((follower) => {
          return {
            id: 1,
            at: follow.followAt,
            userPreview: follow.userPreview,
            type: FeedType.FOLLOW,
            followed: follower.userPreview,
          };
        }),
      );
    });

    return followFeeds;
  }

  async getLocationFeeds(userId: number): Promise<LocationFeed[]> {
    const locationFeeds: LocationFeed[] = [];

    locationFeeds.push({
      id: 2,
      at: new Date(),
      userPreview: {
        id: 12345,
        login: 'nickname123',
        imgUrl: 'profileImg123',
      },
      type: FeedType.LOCATION,
      location: 'c1r1s1',
    });

    return locationFeeds;
  }

  async getStatusMessageFeeds(userId: number): Promise<StatusMessageFeed[]> {
    const statusMessageFeeds: StatusMessageFeed[] = [];

    statusMessageFeeds.push({
      id: 3,
      at: new Date(),
      userPreview: {
        id: 23456,
        login: 'nickname234',
        imgUrl: 'profileImg234',
      },
      type: FeedType.STATUS_MESSAGE,
      message: 'status message',
    });

    return statusMessageFeeds;
  }

  async getTeamStatusFinishedFeeds(
    userId: number,
  ): Promise<TeamStatusFinishedFeed[]> {
    const teamStatusFinishedFeeds: TeamStatusFinishedFeed[] = [];

    teamStatusFinishedFeeds.push({
      id: 4,
      at: new Date(),
      userPreview: {
        id: 34567,
        login: 'nickname345',
        imgUrl: 'profileImg345',
      },
      type: FeedType.TEAM_STATUS_FINISHED,
      teamInfo: 'team status finished',
    });

    return teamStatusFinishedFeeds;
  }

  async getEventFeeds(userId: number): Promise<EventFeed[]> {
    const eventFeeds: EventFeed[] = [];

    eventFeeds.push({
      id: 5,
      at: new Date(),
      userPreview: {
        id: 45678,
        login: 'nickname456',
        imgUrl: 'profileImg456',
      },
      type: FeedType.EVENT,
      event: 'event',
    });

    return eventFeeds;
  }

  async getNewMemberFeeds(userId: number): Promise<NewMemberFeed[]> {
    const newMemberFeeds: NewMemberFeed[] = [];

    newMemberFeeds.push({
      id: 6,
      at: new Date(),
      userPreview: {
        id: 56789,
        login: 'nickname567',
        imgUrl: 'profileImg567',
      },
      type: FeedType.NEW_MEMBER,
      memberAt: new Date(),
    });

    return newMemberFeeds;
  }

  async getBlackholedAtFeeds(userId: number): Promise<BlackholedAtFeed[]> {
    const blackholedAtFeeds: BlackholedAtFeed[] = [];

    blackholedAtFeeds.push({
      id: 7,
      at: new Date(),
      userPreview: {
        id: 67890,
        login: 'nickname678',
        imgUrl: 'profileImg678',
      },
      type: FeedType.BLACKHOLED_AT,
      blackholedAt: new Date(),
    });

    return blackholedAtFeeds;
  }

  //fanout-on-write 방식
  async updateFeed(userId: number, feed: typeof FeedUnion): Promise<void> {
    //나의 팔로워 리스트를 가져옴
    const cachedFollowerList = await this.followCacheService.get(
      userId,
      'follower',
    );

    //팔로워들의 feed에 새로 작성한 feed를 추가
    for (const follower of cachedFollowerList) {
      console.log('write feed: ', follower.userPreview.id, feed);
      //await this.feedCacheService.writeFeed(follower.userPreview.id, feed);
    }
  }

  private generateEmptyFeed(): FeedPaginated {
    return this.paginationCursorService.toPaginated<typeof FeedUnion>(
      [],
      0,
      false,
      cursorExtractor,
    );
  }
}

const cursorExtractor: CursorExtractor<typeof FeedUnion> = (doc) => {
  return `${doc.id.toString()} + ${doc.at.toISOString()}`;
};
