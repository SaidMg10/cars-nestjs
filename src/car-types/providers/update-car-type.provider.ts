import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateCarTypeDto } from '../dto/update-car-type.dto';
import { CarTypeImage } from '../entities/car-type-image.entity';
import { FilesService } from 'src/files/files.service';
import { CarType } from '../entities/car-type.entity';

@Injectable()
export class UpdateCarTypeProvider {
  constructor(
    @InjectRepository(CarType)
    private readonly carTypeRepository: Repository<CarType>,

    private readonly logger: Logger,

    private readonly dataSource: DataSource,

    private readonly filesService: FilesService,
  ) {
    this.logger = new Logger(UpdateCarTypeProvider.name);
  }

  async update(
    id: string,
    updateCarTypeDto: UpdateCarTypeDto,
    file?: Express.Multer.File,
  ) {
    const carType = await this.carTypeRepository.preload({
      id,
      ...updateCarTypeDto,
    });
    if (!carType) throw new NotFoundException(`Car Type id ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let oldImagePath: string | null = null;

    try {
      if (file) {
        const existingImage = await this.dataSource.manager.findOne(
          CarTypeImage,
          {
            where: { carType: { id } },
          },
        );
        if (existingImage) {
          oldImagePath = existingImage.path;

          existingImage.path = (
            await this.filesService.uploadImage(file)
          ).filePath;

          await queryRunner.manager.save(existingImage);
        }
      }
      await queryRunner.manager.save(carType);

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
      return carType;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the car type',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
