import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { IsSlugExistsProvider } from './providers/is-slug-exist.provider';
import { GenerateUniqueSlugProvider } from './providers/generate-unique-slug.provider';

@Module({
  controllers: [CarsController],
  providers: [CarsService, IsSlugExistsProvider, GenerateUniqueSlugProvider],
  imports: [TypeOrmModule.forFeature([Car])],
})
export class CarsModule {}
