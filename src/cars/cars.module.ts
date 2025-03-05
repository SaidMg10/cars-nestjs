import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from 'src/brands/brands.module';
import { CarTypesModule } from 'src/car-types/car-types.module';
import { Car, CarImage } from './entities';
import { FilesModule } from 'src/files/files.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import {
  CreateCarProvider,
  DeleteCarProvider,
  GenerateUniqueSlugProvider,
  GetAllCarsProvider,
  IsSlugExistsProvider,
  UpdateCarProvider,
} from './providers';

@Module({
  controllers: [CarsController],
  providers: [
    CarsService,
    IsSlugExistsProvider,
    GenerateUniqueSlugProvider,
    CreateCarProvider,
    UpdateCarProvider,
    DeleteCarProvider,
    GetAllCarsProvider,
  ],
  imports: [
    PaginationModule,
    TypeOrmModule.forFeature([Car, CarImage]),
    BrandModule,
    CarTypesModule,
    FilesModule,
  ],
  exports: [CarsService],
})
export class CarsModule {}
