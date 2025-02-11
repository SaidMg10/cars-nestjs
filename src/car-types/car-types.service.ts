import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
  async create(createCarTypeDto: CreateCarTypeDto) {
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

  findAll() {
    return `This action returns all carTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carType`;
  }

  update(id: number, updateCarTypeDto: UpdateCarTypeDto) {
    console.log(updateCarTypeDto);
    return `This action updates a #${id} carType`;
  }

  remove(id: number) {
    return `This action removes a #${id} carType`;
  }
}
