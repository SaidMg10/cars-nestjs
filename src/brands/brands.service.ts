import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
// import { UpdateBrandDto } from './dto/update-brand.dto';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return await this.brandRepository.save(brand);
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: string) {
    return await this.brandRepository.findOneBy({ id });
  }

  //  update(id: number, updateBrandDto: UpdateBrandDto) {
  //    return `This action updates a #${id} brand`;
  //  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
