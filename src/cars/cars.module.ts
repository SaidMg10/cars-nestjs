import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsSlugExistsProvider } from './providers/is-slug-exist.provider';
import { GenerateUniqueSlugProvider } from './providers/generate-unique-slug.provider';
import { BrandModule } from 'src/brands/brands.module';
import { CarTypesModule } from 'src/car-types/car-types.module';
import { CreateCarProvider } from './providers/create-car.provider';
import { UpdateCarProvider } from './providers/update-car.provider';
import { Car, CarImage } from './entities';
import { FilesModule } from 'src/files/files.module';
import { DeleteCarProvider } from './providers/delete-car.provider';

@Module({
  controllers: [CarsController],
  providers: [
    CarsService,
    IsSlugExistsProvider,
    GenerateUniqueSlugProvider,
    CreateCarProvider,
    UpdateCarProvider,
    DeleteCarProvider,
  ],
  imports: [
    TypeOrmModule.forFeature([Car, CarImage]),
    BrandModule,
    CarTypesModule,
    FilesModule,
  ],
  exports: [CarsService],
})
export class CarsModule {}
