import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/common.dto.pagination';

@ArgsType()
export class GetEvalLogsArgs extends PaginationArgs {
  @Field({ nullable: true })
  corrector?: string;

  @Field({ nullable: true })
  corrected?: string;

  @Field({ nullable: true })
  projectName?: string;

  @Field({ defaultValue: false })
  outstandingOnly: boolean;
}
