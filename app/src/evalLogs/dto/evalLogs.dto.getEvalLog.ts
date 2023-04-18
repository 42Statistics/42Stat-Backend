import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/dto/common.dto.pagination';

@ArgsType()
export class GetEvalLogsArgs extends PaginationArgs {
  @Field((_type) => String, { nullable: true })
  corrector: string | null;

  @Field((_type) => String, { nullable: true })
  corrected: string | null;

  @Field({ defaultValue: 'libft' })
  projectName: string;

  @Field({ defaultValue: false })
  outstandingOnly: boolean;
}
