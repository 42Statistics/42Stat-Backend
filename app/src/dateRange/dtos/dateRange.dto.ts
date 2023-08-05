import { BadRequestException } from '@nestjs/common';
import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';

export enum DateTemplate {
  /**
   *
   * @description
   * 06-04~06-11 -> 06-04~06-05(today)변경해야할때 확인하기
   */
  CURR_WEEK,
  LAST_WEEK,
  /**
   *
   * @description
   * 06-04~06-11 -> 06-04~06-05(today)변경해야할때 확인하기
   */
  CURR_MONTH,
  LAST_MONTH,

  TOTAL,
}

registerEnumType(DateTemplate, { name: 'DateTemplate' });

export class UnsupportedDateTemplate extends BadRequestException {
  constructor() {
    super('Unsupported DateTemplate');
  }
}

export type DateRange = {
  start: Date;
  end: Date;
};

@ArgsType()
export class DateTemplateArgs {
  @Field((_type) => DateTemplate)
  dateTemplate: DateTemplate;
}

@ArgsType()
export class DateRangeArgs implements DateRange {
  @Field()
  start: Date;

  @Field()
  end: Date;
}
