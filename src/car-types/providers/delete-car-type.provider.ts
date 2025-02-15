import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from '../entities/car-type.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { CarTypesService } from '../car-types.service';

@Injectable()
export class DeleteCarTypeProvider {
  constructor(
    @InjectRepository(CarType)
    private readonly carTypeRepository: Repository<CarType>,

    @Inject(forwardRef(() => CarTypesService))
    private readonly carTypeService: CarTypesService,

    private readonly logger: Logger,

    private readonly filesService: FilesService,
  ) {
    this.logger = new Logger(DeleteCarTypeProvider.name);
  }

  async remove(id: string) {
    const carType = await this.carTypeService.findOne(id);
    try {
      if (carType.carTypeImage) {
        try {
          await this.filesService.deleteFiles(carType.carTypeImage.path);
        } catch (fsError) {
          this.logger.error(
            `Failed to delete brand image: ${carType.carTypeImage.path}`,
            fsError,
          );
        }
      }
      await this.carTypeRepository.remove(carType);
      return `brand with id ${id} removed`;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error while removing a brand',
      );
    }
  }
}
