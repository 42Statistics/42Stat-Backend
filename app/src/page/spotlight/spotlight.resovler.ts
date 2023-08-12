import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import {
  GetSearchResultArgs,
  GetSpotlightArgs,
} from './dtos/spotlight.dto.getSpotlight';
import { SearchResult, Spotlight } from './models/spotlight.model';
import { SpotlightService } from './spotlight.service';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => SearchResult)
export class SpotlightResolver {
  constructor(private readonly spotlightService: SpotlightService) {}

  @Query((_returns) => SearchResult, {
    deprecationReason:
      'v0.7.0: 쿼리 이름 변경: 같은 기능을 하는 getSpotlight 을 사용하세요.',
  })
  async getSearchResult(
    @Args() { input, limit }: GetSearchResultArgs,
  ): Promise<SearchResult> {
    return await this.spotlightService.find(input, limit);
  }

  @Query((_returns) => Spotlight)
  async getSpotlight(
    @Args() { input, limit }: GetSpotlightArgs,
  ): Promise<Spotlight> {
    return await this.spotlightService.find(input, limit);
  }
}
