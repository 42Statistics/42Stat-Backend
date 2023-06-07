import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationCursorArgs } from 'src/pagination/cursor/dtos/pagination.cursor.dtos';

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
}
