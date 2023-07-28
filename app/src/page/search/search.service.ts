import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import type { ProjectPreview } from 'src/api/project/models/project.preview';
import { ProjectService } from 'src/api/project/project.service';
import type { UserPreview } from 'src/common/models/common.user.model';
import { API_CONFIG, type ApiConfig } from 'src/config/api';
import type { SearchResult } from './models/search.model';

@Injectable()
export class SearchService {
  private readonly FT_LOGIN_MAX_LENGTH: number;

  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly projectService: ProjectService,
    private readonly configService: ConfigService,
  ) {
    this.FT_LOGIN_MAX_LENGTH =
      this.configService.getOrThrow<ApiConfig>(API_CONFIG).FT_LOGIN_MAX_LENGTH;
  }

  async search(input: string, limit: number): Promise<SearchResult> {
    const sanitizedInput = sanitizeInput(input);

    const userPreviews = await this.searchUserPreviews(sanitizedInput, limit);
    const projectPreviews = await this.searchProjectPreviews(
      sanitizedInput,
      limit,
    );

    return {
      userPreviews,
      projectPreviews,
    };
  }

  private async searchUserPreviews(
    login: string,
    limit: number,
  ): Promise<UserPreview[]> {
    if (login.length > this.FT_LOGIN_MAX_LENGTH) {
      return [];
    }

    return await this.searchImpl(login, limit, async (searchRegex: RegExp) =>
      this.cursusUserService.findAllUserPreviewAndLean({
        filter: { 'user.login': searchRegex },
        limit,
      }),
    );
  }

  private async searchProjectPreviews(
    name: string,
    limit: number,
  ): Promise<ProjectPreview[]> {
    return await this.searchImpl(name, limit, async (searchRegex: RegExp) =>
      this.projectService.findAllProjectPreviewAndLean({
        filter: { name: searchRegex },
        limit,
      }),
    );
  }

  private async searchImpl<Result extends { id: number }>(
    input: string,
    limit: number,
    searchFn: (searchRegex: RegExp) => Promise<Result[]>,
  ): Promise<Result[]> {
    const result: Map<number, Result> = new Map();

    const prefixMatches = await searchFn(toPrefixMatchRegex(input));

    prefixMatches.forEach((matched) => {
      result.set(matched.id, matched);
    });

    if (prefixMatches.length < limit) {
      const matches = await searchFn(toMatchRegex(input));

      matches.forEach((matched) => result.set(matched.id, matched));
    }

    return [...result.values()];
  }
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
};

const toPrefixMatchRegex = (input: string): RegExp => {
  return new RegExp(`^${input}`, 'i');
};

const toMatchRegex = (input: string): RegExp => {
  return new RegExp(`.${input}`, 'i');
};
