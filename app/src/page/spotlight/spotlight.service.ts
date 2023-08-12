import { Injectable } from '@nestjs/common';
import { RegexFindService } from 'src/lib/regexFind/regexFind.service';
import type { Spotlight } from './models/spotlight.model';

@Injectable()
export class SpotlightService {
  constructor(private readonly regexFindService: RegexFindService) {}

  async find(input: string, limit: number): Promise<Spotlight> {
    const userPreviews = await this.regexFindService.regexFindUserPreview(
      input,
      limit,
    );

    const projectPreviews = await this.regexFindService.regexFindProjectPreview(
      input,
      limit,
    );

    return {
      userPreviews,
      projectPreviews,
    };
  }
}
