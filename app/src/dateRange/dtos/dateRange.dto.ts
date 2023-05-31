import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';

export enum DateTemplate {
  WEEKLY,
  MONTHLY,
}

registerEnumType(DateTemplate, { name: 'DateTemplate' });

@ArgsType()
export class DateTemplateArgs {
  @Field((_type) => DateTemplate)
  dateTemplate: DateTemplate;
}

@ArgsType()
export class DateRangeArgs {
  @Field()
  start: Date;

  @Field()
  end: Date;
}