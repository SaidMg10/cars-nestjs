import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { BrandService } from 'src/brands/brands.service';
import { UpdateCarDto } from '../dto/update-car.dto';
import { CarTypesService } from 'src/car-types/car-types.service';

@Injectable()
export class UpdateCarProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    private readonly logger: Logger,

    private readonly brandService: BrandService,

    private readonly carTypeService: CarTypesService,

    private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(UpdateCarProvider.name);
  }
  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const { brand, carType, ...toUpdate } = updateCarDto;

    const car = await this.carRepository.preload({
      id,
      ...toUpdate,
    });
    if (!car) throw new NotFoundException('The car Id does not exist');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (brand) {
        const brandExist = await this.brandService.findOne(brand);
        car.brand = brandExist;
      }
      if (carType) {
        const carTypeExist = await this.carTypeService.findOne(carType);
        car.carType = carTypeExist;
      }
      await queryRunner.manager.save(car);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return car;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}
