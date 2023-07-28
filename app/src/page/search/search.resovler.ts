import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetSearchResultArgs } from './dtos/search.dto.getSearchResult';
import { SearchResult } from './models/search.model';
import { SearchService } from './search.service';

@Resolver((_of: unknown) => SearchResult)
export class SerachResultResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query((_returns) => SearchResult)
  async getSearchResult(
    @Args() { input, limit }: GetSearchResultArgs,
  ): Promise<SearchResult> {
    return await this.searchService.search(input, limit);
  }
}
