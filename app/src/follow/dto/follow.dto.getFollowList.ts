import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';

export enum FollowSortOrder {
  FOLLOW_AT_ASC,
  FOLLOW_AT_DESC,
}

registerEnumType(FollowSortOrder, { name: 'FollowSortOrder' });

@ArgsType()
export class FollowListPaginatedArgs extends PaginationCursorArgs {
  @Field()
  target: string;

  @Field((_type) => FollowSortOrder, {
    defaultValue: FollowSortOrder.FOLLOW_AT_DESC,
  })
  sortOrder: FollowSortOrder;
}
