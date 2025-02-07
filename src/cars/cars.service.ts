import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { GenerateUniqueSlugProvider } from './providers/generate-unique-slug.provider';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    private readonly generateUniqueSlugProvider: GenerateUniqueSlugProvider,

    private readonly logger: Logger,
  ) {
    this.logger = new Logger(CarsService.name);
  }
  async create(createCarDto: CreateCarDto): Promise<Car> {
    //TODO:Agregar las respectivas relaciones
    const { model, version } = createCarDto;

    const car = this.carRepository.create({
      ...createCarDto,
      slug: await this.generateUniqueSlugProvider.generateUniqueSlug(
        model,
        version,
      ),
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

  async findAll(): Promise<Car[]> {
    const cars = await this.carRepository.find();
    if (cars.length === 0)
      throw new NotFoundException('No cars found in the database');
    return cars;
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) throw new NotFoundException(`Car with ID  ${id} not found`);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carRepository.preload({
      id,
      ...updateCarDto,
    });
    if (!car) throw new NotFoundException('The post Id does not exist');

    try {
      return await this.carRepository.save(car);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error occurred while saving the car',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
