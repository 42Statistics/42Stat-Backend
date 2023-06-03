import { Module } from '@nestjs/common';
import { PaginationIndexService } from './pagination.index.service';

@Module({
  providers: [PaginationIndexService],
  exports: [PaginationIndexService],
})
export class PaginationIndexModule {}
