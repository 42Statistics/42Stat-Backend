import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/pagination/dto/pagination.dto.args';

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
