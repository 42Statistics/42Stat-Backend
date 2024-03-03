import { registerEnumType } from '@nestjs/graphql';

export enum FeedType {
  FOLLOW = 'FOLLOW',
  STATUS_MESSAGE = 'STATUS_MESSAGE',
  LOCATION = 'LOCATION',
  NEW_MEMBER = 'NEW_MEMBER',
  BLACKHOLED_AT = 'BLACKHOLED_AT',
  TEAM_STATUS_FINISHED = 'TEAM_STATUS_FINISHED',
  EVENT = 'EVENT',
}

registerEnumType(FeedType, { name: 'FeedType' });
