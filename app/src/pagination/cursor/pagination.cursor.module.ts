import { Module } from '@nestjs/common';
import { PaginationCursorService } from './pagination.cursor.service';

@Module({
  providers: [PaginationCursorService],
  exports: [PaginationCursorService],
})
// eslint-disable-next-line
export class PaginationCursorModule {}
