/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
  async create(createCarDto: CreateCarDto) {
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

  findAll() {
    return `This action returns all cars`;
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
