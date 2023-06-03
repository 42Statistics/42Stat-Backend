import { ObjectType } from '@nestjs/graphql';
import { DateRanged } from 'src/dateRange/models/dateRange.model';
import { NumericRate } from './common.rate.model';

@ObjectType()
export class NumberDateRanged extends DateRanged(Number) {}

@ObjectType()
export class StringDateRanged extends DateRanged(String) {}

@ObjectType()
export class NumericRateDateRanged extends DateRanged(NumericRate) {}
