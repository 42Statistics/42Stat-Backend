import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { promo, promoSchema } from './db/promo.database.schema';
import { PromoService } from './promo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: promoSchema, name: promo.name }]),
  ],
  providers: [PromoService],
  exports: [PromoService],
})
// eslint-disable-next-line
export class PromoModule {}
