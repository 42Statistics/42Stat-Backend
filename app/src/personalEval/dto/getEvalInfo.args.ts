import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';

export enum EvalUserEnum {
  ANY,
  CORRECTOR,
  CORRECTED,
}

registerEnumType(EvalUserEnum, {
  name: 'EvalUserEnum',
});

@ArgsType()
export class GetEvalInfoArgs {
  @Field((_type) => EvalUserEnum)
  evalUserType: EvalUserEnum;

  @Field({ nullable: true })
  subjectName?: string;

  @Field({ nullable: true })
  targetUserName?: string;

  @Field({ nullable: true })
  outstandingOnly?: boolean;
}
