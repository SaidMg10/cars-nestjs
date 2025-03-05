import { Module } from '@nestjs/common';
import { PaginationModule } from './pagination/pagination.module';
@Module({
  controllers: [],
  providers: [],
  imports: [PaginationModule],
})
export class CommonModule {}
