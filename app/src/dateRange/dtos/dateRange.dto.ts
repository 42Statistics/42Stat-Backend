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
  /**
   *
   * @description
   * curr = 23-05-18
   * lastYear = 22-06-01 ~ 23-06-01
   */
  LAST_YEAR,
}

registerEnumType(DateTemplate, { name: 'DateTemplate' });

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
