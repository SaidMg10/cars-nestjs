import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entities/car.entity';
import { Repository } from 'typeorm';
import { BrandService } from 'src/brands/brands.service';
import { CreateCarDto } from 'src/cars/dto/create-car.dto';
import { GenerateUniqueSlugProvider } from './generate-unique-slug.provider';
import { CarTypesService } from 'src/car-types/car-types.service';

@Injectable()
export class CreateCarProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    private readonly logger: Logger,

    private readonly brandService: BrandService,

    private readonly generateUniqueSlugProvider: GenerateUniqueSlugProvider,

    private readonly carTypeService: CarTypesService,
  ) {
    this.logger = new Logger(CreateCarProvider.name);
  }

  async create(createCarDto: CreateCarDto): Promise<Car> {
    //TODO:Agregar las respectivas relaciones
    const brand = await this.brandService.findOne(createCarDto.brand);
    const carType = await this.carTypeService.findOne(createCarDto.carType);
    const { model, version } = createCarDto;

    const car = this.carRepository.create({
      ...createCarDto,
      slug: await this.generateUniqueSlugProvider.generateUniqueSlug(
        model,
        version,
      ),
      brand,
      carType,
    });
    try {
      return await this.carRepository.save(car);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error occurred while saving the car',
      );
    }
  }
}
