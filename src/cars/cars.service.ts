/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
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
      throw new BadRequestException('No cars found in the database');
    return cars;
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) throw new BadRequestException(`Car with ID  ${id} not found`);
    return car;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
