import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entities/car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IsSlugExistsProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async isSlugExists(slug: string): Promise<boolean> {
    const car = await this.carRepository.findOneBy({ slug });
    return !!car;
  }
}
