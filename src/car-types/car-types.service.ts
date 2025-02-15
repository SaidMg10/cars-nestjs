import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from './entities/car-type.entity';
import { Repository } from 'typeorm';
import {
  CreateCarTypeProvider,
  DeleteCarTypeProvider,
  UpdateCarTypeProvider,
} from './providers';

@Injectable()
export class CarTypesService {
  constructor(
    @InjectRepository(CarType)
    private readonly carTypeRepository: Repository<CarType>,

    private readonly createCarTypeProvider: CreateCarTypeProvider,

    private readonly updateCarTypeProvider: UpdateCarTypeProvider,

    private readonly deleteCarTypeProvider: DeleteCarTypeProvider,
  ) {}
  async create(
    createCarTypeDto: CreateCarTypeDto,
    file: Express.Multer.File,
  ): Promise<CarType> {
    return await this.createCarTypeProvider.create(createCarTypeDto, file);
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
    file?: Express.Multer.File,
  ): Promise<CarType> {
    return await this.updateCarTypeProvider.update(id, updateCarTypeDto, file);
  }

  async remove(id: string): Promise<string> {
    return await this.deleteCarTypeProvider.remove(id);
  }
}
