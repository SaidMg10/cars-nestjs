import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from '../entities/car-type.entity';
import { DataSource, Repository } from 'typeorm';
import { CarTypeImage } from '../entities/car-type-image.entity';
import { FilesService } from 'src/files/files.service';
import { CreateCarTypeDto } from '../dto/create-car-type.dto';

@Injectable()
export class CreateCarTypeProvider {
  constructor(
    @InjectRepository(CarType)
    private readonly carTypeRepository: Repository<CarType>,

    @InjectRepository(CarTypeImage)
    private readonly carTypeImageRepository: Repository<CarTypeImage>,

    private readonly logger: Logger,

    private readonly filesService: FilesService,

    private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(CreateCarTypeProvider.name);
  }
  async create(
    createCarTypeDto: CreateCarTypeDto,
    file: Express.Multer.File,
  ): Promise<CarType> {
    if (!file) throw new BadRequestException('Car type image is required');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let path: string | null = null;

    try {
      const uploadImage = await this.filesService.uploadImage(file);
      path = uploadImage.filePath;

      const carTypeImage = this.carTypeImageRepository.create({ path });

      await queryRunner.manager.save(carTypeImage);

      const carType = this.carTypeRepository.create({
        ...createCarTypeDto,
        carTypeImage,
      });

      await queryRunner.manager.save(carType);
      await queryRunner.commitTransaction();
      return carType;
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
        'An error ocurred while creating a Car Typoe',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
