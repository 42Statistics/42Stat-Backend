import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import {
  dateRangeFromTemplate,
  generateDateRanged,
} from 'src/dateRange/dateRange.service';
import { DateRangeArgs, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';
import {
  PreferredTimeElement,
  PreferredTimeElementDateRanged,
} from '../models/personal.general.model';

@Injectable()
export class PreferredTimeService {
  constructor(private locationService: LocationService) {}

  async preferredTime(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<PreferredTimeElement> {
    const preferredTime = await this.locationService.preferredTime(
      userId,
      filter,
    );

    return preferredTime;
  }

  async preferredTimeByDateRange(
    userId: number,
    { start, end }: DateRangeArgs,
  ): Promise<PreferredTimeElementDateRanged> {
    const dateFilter: FilterQuery<location> = {
      beginAt: { $gte: start, $lt: end },
      filledAt: { $ne: null },
    };

    const preferredTime = await this.preferredTime(userId, dateFilter);

    return generateDateRanged(preferredTime, start, end);
  }

  async preferredTimeByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<PreferredTimeElementDateRanged> {
    const dateRange = dateRangeFromTemplate(dateTemplate);

    return this.preferredTimeByDateRange(userId, dateRange);
  }
}
