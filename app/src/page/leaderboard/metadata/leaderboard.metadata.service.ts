import { Injectable } from '@nestjs/common';
import { CoalitionService } from 'src/api/coalition/coalition.service';
import { PromoService } from 'src/api/promo/promo.service';
import type { Coalition } from 'src/page/common/models/coalition.model';
import type { Promo } from 'src/page/common/models/promo.model';

@Injectable()
export class LeaderboardMetadataService {
  constructor(
    private readonly promoService: PromoService,
    private readonly coalitionService: CoalitionService,
  ) {}

  async promoList(): Promise<Promo[]> {
    return await this.promoService.promoList();
  }

  async coalitionList(): Promise<Coalition[]> {
    return await this.coalitionService.getSeoulCoalitions();
  }
}
