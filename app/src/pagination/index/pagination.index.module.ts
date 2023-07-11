import { Module } from '@nestjs/common';
import { PaginationIndexService } from './pagination.index.service';

@Module({
  providers: [PaginationIndexService],
  exports: [PaginationIndexService],
})
// eslint-disable-next-line
export class PaginationIndexModule {}
