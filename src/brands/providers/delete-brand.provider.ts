import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../entities/brand.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { BrandService } from '../brands.service';

@Injectable()
export class DeleteBrandProvider {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    private readonly logger: Logger,

    private readonly filesService: FilesService,

    @Inject(forwardRef(() => BrandService))
    private readonly brandService: BrandService,
  ) {
    this.logger = new Logger(DeleteBrandProvider.name);
  }

  async remove(id: string) {
    const brand = await this.brandService.findOne(id);
    try {
      if (brand.brandImage) {
        try {
          await this.filesService.deleteFiles(brand.brandImage.path);
        } catch (fsError) {
          this.logger.error(
            `Failed to delete brand image: ${brand.brandImage.path}`,
            fsError,
          );
        }
      }
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
