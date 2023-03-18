import { registerEnumType } from '@nestjs/graphql';

export enum GraphInterval {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

registerEnumType(GraphInterval, {
  name: 'GraphInterval',
});
