import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GetCarsDto } from '../dto/get-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entities';
import { Repository } from 'typeorm';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/provider/pagination.provider';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class GetAllCarsProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly paginationProvider: PaginationProvider,

    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GetAllCarsProvider.name);
  }

  async findAll(filters?: GetCarsDto): Promise<Paginated<Car>> {
    const { limit = 10, page = 1, brandId, carTypeId } = filters || {};

    const query = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.carType', 'carType')
      .leftJoinAndSelect('car.carImages', 'carImages');

    if (brandId) {
      query.andWhere('car.brandId = :brandId', { brandId });
    }
    if (carTypeId) {
      query.andWhere('car.carTypeId = :carTypeId', { carTypeId });
    }

    const cars = await this.paginationProvider.paginateQuery(
      {
        limit,
        page,
      },
      query,
      this.request,
    );

    if (cars.data.length === 0) {
      throw new HttpException(
        'No cars found with the given filters.',
        HttpStatus.NO_CONTENT,
      );
    }

    return cars;
  }
}
