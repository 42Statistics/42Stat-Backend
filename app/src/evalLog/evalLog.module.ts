import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvalLogController } from './evalLog.controller';
import { EvalLog, EvalLogSchema } from './evalLog.database.schema';
import { EvalLogService } from './evalLog.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: EvalLog.name, schema: EvalLogSchema }])],
  providers: [EvalLogService],
  controllers: [EvalLogController],
  exports: [MongooseModule.forFeature([{ name: EvalLog.name, schema: EvalLogSchema }])],
})
export class EvalLogModule {}
