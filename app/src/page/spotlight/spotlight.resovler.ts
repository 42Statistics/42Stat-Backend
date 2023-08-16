import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { GetSpotlightArgs } from './dtos/spotlight.dto.getSpotlight';
import { Spotlight } from './models/spotlight.model';
import { SpotlightService } from './spotlight.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => Spotlight)
export class SpotlightResolver {
  constructor(private readonly spotlightService: SpotlightService) {}

  @Query((_returns) => Spotlight)
  async getSpotlight(
    @Args() { input, limit }: GetSpotlightArgs,
  ): Promise<Spotlight> {
    return await this.spotlightService.find(input, limit);
  }
}
