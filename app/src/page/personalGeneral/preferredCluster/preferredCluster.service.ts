import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { location } from 'src/api/location/db/location.database.schema';
import { LocationService } from 'src/api/location/location.service';
import { StringDateRanged } from 'src/common/models/common.number.dateRanaged';
import {
  dateRangeFromTemplate,
  generateDateRanged,
} from 'src/dateRange/dateRange.service';
import { DateRangeArgs, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class PreferredClusterService {
  constructor(private locationService: LocationService) {}

  async preferredCluster(
    userId: number,
    filter?: FilterQuery<location>,
  ): Promise<string> {
    return await this.locationService.preferredCluster(userId, filter);
  }

  async preferredClusterByDateRange(
    userId: number,
    { start, end }: DateRangeArgs,
  ): Promise<StringDateRanged> {
    const dateFilter: FilterQuery<location> = {
      beginAt: { $gte: start, $lt: end },
      filledAt: { $ne: null },
    };

    const preferredCluster = await this.preferredCluster(userId, dateFilter);

    return generateDateRanged(preferredCluster, start, end);
  }

  async preferredClusterByDateTemplate(
    userId: number,
    dateTemplate: DateTemplate,
  ): Promise<StringDateRanged> {
    const dateRange = dateRangeFromTemplate(dateTemplate);

    return this.preferredClusterByDateRange(userId, dateRange);
  }
}
