import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from './entities/car-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarTypesService {
  constructor(
    @InjectRepository(CarType)
    private readonly carTypeRepository: Repository<CarType>,

    private readonly logger: Logger,
  ) {
    this.logger = new Logger(CarTypesService.name);
  }
  async create(createCarTypeDto: CreateCarTypeDto): Promise<CarType> {
    const carType = this.carTypeRepository.create(createCarTypeDto);
    try {
      return await this.carTypeRepository.save(carType);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error while saving the car type',
      );
    }
  }

  async findAll(): Promise<CarType[]> {
    const typeCars = await this.carTypeRepository.find();
    if (typeCars.length === 0) {
      throw new HttpException('No car types available', HttpStatus.NO_CONTENT);
    }
    return typeCars;
  }

  async findOne(id: string): Promise<CarType> {
    const carType = await this.carTypeRepository.findOneBy({ id });
    if (!carType)
      throw new NotFoundException(`Car Type with id ${id} not found`);
    return carType;
  }

  async update(
    id: string,
    updateCarTypeDto: UpdateCarTypeDto,
  ): Promise<CarType> {
    const carType = await this.carTypeRepository.preload({
      id,
      ...updateCarTypeDto,
    });
    if (!carType)
      throw new NotFoundException(`Car Type with id ${id} not found`);
    try {
      return await this.carTypeRepository.save(carType);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error ocurred while updating a car type',
      );
    }
  }

  async remove(id: string): Promise<string> {
    const carType = await this.findOne(id);
    try {
      await this.carTypeRepository.remove(carType);
      return `the car type ${carType.name} was removed`;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error ocurred while removing the car type',
      );
    }
  }
}
