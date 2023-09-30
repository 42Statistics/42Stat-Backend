import { Injectable } from '@nestjs/common';
import { PromoService } from 'src/api/promo/promo.service';
import type { Promo } from 'src/page/common/models/promo.model';

@Injectable()
export class LeaderboardMetadataService {
  constructor(private readonly promoService: PromoService) {}

  async promoList(): Promise<Promo[]> {
    return await this.promoService.promoList();
  }
}
