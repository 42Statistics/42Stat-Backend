import { registerAs } from '@nestjs/config';
import type { ProjectPreview } from 'src/common/models/common.project.model';

export type ApiConfig = {
  readonly SEOUL_COALITION_ID: number[];
  readonly FT_LOGIN_MAX_LENGTH: number;
  readonly SEOUL_CAMPUS_ID: number;
  readonly PROJECT_BASE_URL: string;
  readonly NETWHAT_PREVIEW: ProjectPreview;
  readonly PROJECT_CIRCLES: Record<number, number>;
};

export const API_CONFIG = 'api';

export const SEOUL_COALITION_ID = [85, 86, 87, 88];
export const SEOUL_CAMPUS_ID = 29;
export const FT_LOGIN_MAX_LENGTH = 10;
export const PROJECT_BASE_URL = 'https://projects.intra.42.fr/projects';

export const PROJECT_CIRCLES = {
  1314: 0, // libft
  1316: 1, // ft_printf
  1327: 1, // get_next_line
  1994: 1, // born2beroot,
  1471: 2, // push_swap
  2004: 2, // pipex,
  2005: 2, // minitalk,
  2009: 2, // so_long
  2008: 2, // fdf
  1476: 2, // fract-ol,
  1320: 2, // exam rank 02
  1334: 3, // philosophers,
  1331: 3, // minishell,
  1321: 3, // exam rank 03
  1326: 4, // cub3d
  1315: 4, // minirt,
  1338: 4, // CPP Module 00
  1339: 4, // CPP Module 01
  1340: 4, // CPP Module 02
  1341: 4, // CPP Module 03
  1342: 4, // CPP Module 04
  2007: 4, // netpractice
  1322: 4, // exam rank 04
  1343: 5, // CPP Module 05
  1344: 5, // CPP Module 06
  1345: 5, // CPP Module 07
  1346: 5, // CPP Module 08
  2309: 5, // CPP Module 09
  1332: 5, // webserv
  1336: 5, // ft_irc
  1983: 5, // inception
  1323: 5, // exam rank 05
  1337: 6, // ft_transcendence
  1324: 6, // exam rank 06
} as const;

export const projectUrlById = (id: number): string =>
  [PROJECT_BASE_URL, id.toString()].join('/');

export const NETWHAT_PREVIEW = {
  id: 1318,
  name: 'netwhat',
  url: projectUrlById(1318),
};

export const apiConfig = registerAs(
  API_CONFIG,
  () =>
    ({
      SEOUL_COALITION_ID,
      FT_LOGIN_MAX_LENGTH,
      SEOUL_CAMPUS_ID,
      PROJECT_BASE_URL,
      NETWHAT_PREVIEW,
      PROJECT_CIRCLES,
    } satisfies ApiConfig),
);
