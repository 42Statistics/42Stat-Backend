import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
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
  @Field({ defaultValue: EvalUserEnum.ANY })
  evalUserType: EvalUserEnum;

  @Field((_type) => String, { nullable: true })
  subjectName: string | null;

  @Field((_type) => String, { nullable: true })
  targetUserName: string | null;

  @Field((_type) => Boolean, { nullable: true })
  outstandingOnly: boolean | null;
}
