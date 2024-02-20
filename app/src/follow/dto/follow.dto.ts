import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';

export enum FollowSortOrder {
  FOLLOW_AT_ASC,
  FOLLOW_AT_DESC,
}

registerEnumType(FollowSortOrder, { name: 'FollowSortOrder' });

@ArgsType()
export class FollowPaginatedArgs extends PaginationIndexArgs {
  @Field()
  targetId: number;

  @Field((_type) => FollowSortOrder, {
    defaultValue: FollowSortOrder.FOLLOW_AT_DESC,
  })
  sortOrder: FollowSortOrder;
}
