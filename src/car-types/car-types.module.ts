import { Module } from '@nestjs/common';
import { CarTypesService } from './car-types.service';
import { CarTypesController } from './car-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarType } from './entities/car-type.entity';
import { CarTypeImage } from './entities/car-type-image.entity';
import { FilesModule } from 'src/files/files.module';
import { CreateCarTypeProvider } from './providers/create-car-type.provider';
import { UpdateCarTypeProvider } from './providers/update-car-type.provider';
import { DeleteCarTypeProvider } from './providers/delete-car-type.provider';

@Module({
  controllers: [CarTypesController],
  providers: [
    CarTypesService,
    CreateCarTypeProvider,
    UpdateCarTypeProvider,
    DeleteCarTypeProvider,
  ],
  imports: [TypeOrmModule.forFeature([CarType, CarTypeImage]), FilesModule],
  exports: [CarTypesService],
})
export class CarTypesModule {}
