import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { BrandImage } from '../entities/brand-image.entities';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CreateBrandProvider {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(BrandImage)
    private readonly brandImageRepository: Repository<BrandImage>,

    private readonly dataSource: DataSource,

    private readonly filesService: FilesService,

    private readonly logger: Logger,
  ) {
    this.logger = new Logger(CreateBrandProvider.name);
  }
  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Brand image is required');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    let path: string | null = null;

    try {
      console.log('Received file:', file);
      const uploadImage = await this.filesService.uploadImage(file);
      path = uploadImage.filePath;
      console.log('Upload result:', uploadImage);

      const brandImage = this.brandImageRepository.create({ path });

      await queryRunner.manager.save(brandImage);
      const brand = this.brandRepository.create({
        ...createBrandDto,
        brandImage: brandImage,
      });
      await queryRunner.manager.save(brand);

      await queryRunner.commitTransaction();
      return brand;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (path) {
        try {
          await this.filesService.deleteFiles(path);
        } catch (fsError) {
          this.logger.error(`Failed to delete image: ${path}`, fsError);
        }
      }
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An error ocurred while creating the brand',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
