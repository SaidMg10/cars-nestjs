import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities';
import { GetCarsDto } from './dto/get-car.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import {
  CreateCarProvider,
  DeleteCarProvider,
  GetAllCarsProvider,
  UpdateCarProvider,
} from './providers';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    private readonly createCarProvider: CreateCarProvider,

    private readonly updateCarProvider: UpdateCarProvider,

    private readonly getAllCarsProvider: GetAllCarsProvider,

    @Inject(forwardRef(() => DeleteCarProvider))
    private readonly deleteCarProvider: DeleteCarProvider,

    private readonly logger: Logger,
  ) {
    this.logger = new Logger(CarsService.name);
  }
  async create(
    createCarDto: CreateCarDto,
    files: Array<Express.Multer.File>,
  ): Promise<Car> {
    return await this.createCarProvider.create(createCarDto, files);
  }

  async findAll(filters?: GetCarsDto): Promise<Paginated<Car>> {
    return await this.getAllCarsProvider.findAll(filters);
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) throw new NotFoundException(`Car with ID  ${id} not found`);
    return car;
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    files: Array<Express.Multer.File>,
  ): Promise<Car> {
    return await this.updateCarProvider.update(id, updateCarDto, files);
  }

  async remove(id: string): Promise<string> {
    return await this.deleteCarProvider.remove(id);
  }
}
