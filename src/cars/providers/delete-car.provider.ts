import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { CarsService } from '../cars.service';
import { Car } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCarProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    @Inject(forwardRef(() => CarsService))
    private readonly carService: CarsService,

    private readonly logger: Logger,

    private readonly filesService: FilesService,
  ) {
    this.logger = new Logger(DeleteCarProvider.name);
  }

  async remove(id: string) {
    const car = await this.carService.findOne(id);
    try {
      if (car.carImages) {
        try {
          await this.filesService.deleteFiles(
            car.carImages.map((img) => img.path),
          );
        } catch (fsError) {
          this.logger.error(
            `Failed to delete brand image: ${car.carImages.map((img) => img.path).join(', ')}`,
            fsError,
          );
        }
      }
      await this.carRepository.remove(car);
      return `car with id ${id} removed`;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error while removing a car',
      );
    }
  }
}
