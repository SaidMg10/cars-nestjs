import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { DataSource, Repository } from 'typeorm';
import { BrandImage } from '../entities/brand-image.entities';
import { FilesService } from 'src/files/files.service';
import { UpdateBrandDto } from '../dto/update-brand.dto';

@Injectable()
export class UpdateBrandProvider {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(BrandImage)
    private readonly brandImageRepository: Repository<BrandImage>,

    private readonly logger: Logger,

    private readonly filesService: FilesService,

    private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(UpdateBrandProvider.name);
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
    file?: Express.Multer.File,
  ) {
    const brand = await this.brandRepository.preload({ id, ...updateBrandDto });
    if (!brand) throw new NotFoundException(`Brand with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let oldImagePath: string | null = null;

    try {
      if (file) {
        const existingImage = await queryRunner.manager.findOne(BrandImage, {
          where: { brand: { id } },
        });

        if (existingImage) {
          oldImagePath = existingImage.path;

          existingImage.path = (
            await this.filesService.uploadImage(file)
          ).filePath;

          await queryRunner.manager.save(existingImage);
        }
      }
      await queryRunner.manager.save(brand);

      if (oldImagePath) {
        try {
          await this.filesService.deleteFiles(oldImagePath);
        } catch (fsError) {
          this.logger.error(
            `Failed to delete old image: ${oldImagePath}`,
            fsError,
          );
        }
      }

      await queryRunner.commitTransaction();
      return brand;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the brand',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
