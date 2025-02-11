import {
  HttpException,
  HttpStatus,
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
import { CreateCarProvider } from './providers/create-car.provider';
import { UpdateCarProvider } from './providers/update-car.provider';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    private readonly createCarProvider: CreateCarProvider,

    private readonly updateCarProvider: UpdateCarProvider,

    private readonly logger: Logger,
  ) {
    this.logger = new Logger(CarsService.name);
  }
  async create(createCarDto: CreateCarDto): Promise<Car> {
    return await this.createCarProvider.create(createCarDto);
  }

  async findAll(): Promise<Car[]> {
    const cars = await this.carRepository.find();
    if (cars.length === 0)
      throw new HttpException('No cars found', HttpStatus.NO_CONTENT);
    return cars;
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) throw new NotFoundException(`Car with ID  ${id} not found`);
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    return await this.updateCarProvider.update(id, updateCarDto);
  }

  async remove(id: string): Promise<string> {
    const car = await this.findOne(id);
    try {
      await this.carRepository.remove(car);
      return `Car with ID ${id} was removed`;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(
        'An internal error ocurred while removing the car',
      );
    }
  }
}
