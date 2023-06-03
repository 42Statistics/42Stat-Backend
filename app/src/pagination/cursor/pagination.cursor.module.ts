import { Module } from '@nestjs/common';
import { PaginationCursorService } from './pagination.cursor.service';

@Module({
  providers: [PaginationCursorService],
  exports: [PaginationCursorService],
})
export class PaginationCursorModule {}
