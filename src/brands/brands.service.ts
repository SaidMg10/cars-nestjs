import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandProvider } from './providers/create-brand.provider';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    private readonly logger: Logger,

    private readonly createBrandProvider: CreateBrandProvider,
  ) {
    this.logger = new Logger(BrandService.name);
  }
  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
    return await this.createBrandProvider.create(createBrandDto, file);
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.brandRepository.find();
    if (brands.length === 0)
      throw new HttpException('No brands found', HttpStatus.NO_CONTENT);
    return brands;
  }

  async findOne(id: string) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand)
      throw new NotFoundException(`The brand with id ${id} does not exist`);
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id,
      ...updateBrandDto,
    });
    if (!brand)
      throw new NotFoundException(`This brand with id ${id} does not exist`);
    try {
      return await this.brandRepository.save(brand);
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(
        'An internal error occurred while updating the brand',
      );
    }
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    try {
      await this.brandRepository.remove(brand);
      return `brand with id ${id} removed`;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An internal error while removing a brand',
      );
    }
  }
}
