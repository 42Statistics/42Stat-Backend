import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.dto.args';

@ArgsType()
export class GetEvalLogsArgs extends PaginationIndexArgs {
  @Field({ nullable: true })
  corrector?: string;

  @Field({ nullable: true })
  corrected?: string;

  @Field({ nullable: true })
  projectName?: string;

  @Field({ defaultValue: false })
  outstandingOnly: boolean;
}
