import { Module } from '@nestjs/common';
import { BrandService } from './brands.service';
import { BrandController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandImage } from './entities/brand-image.entities';
import { CreateBrandProvider } from './providers/create-brand.provider';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService, CreateBrandProvider],
  imports: [TypeOrmModule.forFeature([Brand, BrandImage]), FilesModule],
  exports: [BrandService],
})
export class BrandModule {}
