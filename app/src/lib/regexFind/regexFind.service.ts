import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { ProjectService } from 'src/api/project/project.service';
import type { ProjectPreview } from 'src/common/models/common.project.model';
import type { UserPreview } from 'src/common/models/common.user.model';
import { API_CONFIG } from 'src/config/api';

@Injectable()
export class RegexFindService {
  constructor(
    private readonly cursusUserService: CursusUserService,
    private readonly projectService: ProjectService,
    @Inject(API_CONFIG.KEY)
    private readonly apiConfig: ConfigType<typeof API_CONFIG>,
  ) {}

  async regexFindUserPreview(
    login: string,
    limit: number,
  ): Promise<UserPreview[]> {
    if (login.length > this.apiConfig.FT_LOGIN_MAX_LENGTH) {
      return [];
    }

    return await regexFind({
      input: login.toLowerCase(),
      limit,
      findFn: async (searchRegex) =>
        this.cursusUserService.findAllUserPreviewAndLean({
          filter: { 'user.login': searchRegex },
          limit,
        }),
    });
  }

  async regexFindProjectPreview(
    name: string,
    limit: number,
  ): Promise<ProjectPreview[]> {
    return await regexFind({
      input: name,
      limit,
      findFn: async (searchRegex) =>
        this.projectService.findAllProjectPreviewAndLean({
          filter: { name: searchRegex },
          limit,
        }),
      regexFlags: 'i',
    });
  }
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
};

type StringToRegexFn = (input: string, flags?: string) => RegExp;

const toPrefixMatchRegex: StringToRegexFn = (input, flags) => {
  return new RegExp(`^${input}`, flags);
};

const toMatchRegex: StringToRegexFn = (input, flags) => {
  return new RegExp(`.${input}`, flags);
};

const regexFind = async <TResult extends { id: number }>({
  input,
  limit,
  findFn,
  regexFlags,
}: {
  input: string;
  limit: number;
  findFn: (searchRegex: RegExp) => Promise<TResult[]>;
  regexFlags?: string;
}): Promise<TResult[]> => {
  const sanitizedInput = sanitizeInput(input);

  const result: Map<number, TResult> = new Map();

  const prefixMatches = await findFn(
    toPrefixMatchRegex(sanitizedInput, regexFlags),
  );

  prefixMatches.forEach((matched) => {
    result.set(matched.id, matched);
  });

  if (prefixMatches.length < limit) {
    const matches = await findFn(toMatchRegex(sanitizedInput, regexFlags));

    matches.forEach((matched) => result.set(matched.id, matched));
  }

  return [...result.values()].slice(0, limit);
};
