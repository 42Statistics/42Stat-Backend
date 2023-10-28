import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dto';

export enum EvalLogSortOrder {
  BEGIN_AT_ASC,
  BEGIN_AT_DESC,
}

registerEnumType(EvalLogSortOrder, { name: 'EvalLogSortOrder' });

@ArgsType()
export class GetEvalLogsArgs extends PaginationCursorArgs {
  @Field({ nullable: true })
  corrector?: string;

  @Field({ nullable: true })
  corrected?: string;

  @Field({ nullable: true })
  projectName?: string;

  @Field({ defaultValue: false })
  outstandingOnly: boolean;

  @Field({ defaultValue: false })
  imperfectOnly: boolean;

  @Field((_type) => EvalLogSortOrder, {
    defaultValue: EvalLogSortOrder.BEGIN_AT_DESC,
  })
  sortOrder: EvalLogSortOrder;
}
