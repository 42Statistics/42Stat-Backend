import { ObjectType } from '@nestjs/graphql';
import { DateRanged } from 'src/dateRange/models/dateRange.model';

@ObjectType()
export class NumberDateRanged extends DateRanged(Number) {}

@ObjectType()
export class StringDateRanged extends DateRanged(String) {}
