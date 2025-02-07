import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  imports: [TypeOrmModule.forFeature([Car])],
})
export class CarsModule {}
