import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoalitionService } from './coalition.service';
import { coalition, CoalitionSchema } from './db/coalition.database.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: coalition.name, schema: CoalitionSchema },
    ]),
  ],
  providers: [CoalitionService],
  exports: [MongooseModule, CoalitionService],
})
// eslint-disable-next-line
export class CoalitionModule {}
