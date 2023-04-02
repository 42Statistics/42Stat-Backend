import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/pagination/pagination.args';

export enum EvalUserEnum {
  ANY,
  CORRECTOR,
  CORRECTED,
}

registerEnumType(EvalUserEnum, {
  name: 'EvalUserEnum',
});

@ArgsType()
export class GetEvalInfoArgs extends PaginationArgs {
  @Field((_type) => Int)
  uid: number;

  @Field({ defaultValue: EvalUserEnum.ANY })
  evalUserType: EvalUserEnum = EvalUserEnum.ANY;

  @Field((_type) => String, { nullable: true })
  projectName: string | null = 'libft';

  @Field((_type) => String, { nullable: true })
  targetUserName: string | null = null;

  @Field((_type) => Boolean, { nullable: true })
  outstandingOnly: boolean | null = null;
}
