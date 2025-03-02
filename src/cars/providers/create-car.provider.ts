import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../entities/car.entity';
import { DataSource, Repository } from 'typeorm';
import { BrandService } from 'src/brands/brands.service';
import { CreateCarDto } from 'src/cars/dto/create-car.dto';
import { GenerateUniqueSlugProvider } from './generate-unique-slug.provider';
import { CarTypesService } from 'src/car-types/car-types.service';
import { FilesService } from 'src/files/files.service';
import { CarImage } from '../entities';

@Injectable()
export class CreateCarProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    @InjectRepository(CarImage)
    private readonly carImageRepository: Repository<CarImage>,

    private readonly logger: Logger,

    private readonly brandService: BrandService,

    private readonly generateUniqueSlugProvider: GenerateUniqueSlugProvider,

    private readonly carTypeService: CarTypesService,

    private readonly dataSource: DataSource,

    private readonly filesService: FilesService,
  ) {
    this.logger = new Logger(CreateCarProvider.name);
  }

  async create(
    createCarDto: CreateCarDto,
    files: Array<Express.Multer.File>,
  ): Promise<Car> {
    if (!files || files.length === 0)
      throw new BadRequestException('Car images is required');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let paths: string[] | null = null;

    try {
      const uploadImages = await this.filesService.uploadImages(files);
      paths = uploadImages.map((img) => img.filePath);

      const carImages = paths.map((path) =>
        this.carImageRepository.create({ path }),
      );

      const brand = await this.brandService.findOne(createCarDto.brand);
      const carType = await this.carTypeService.findOne(createCarDto.carType);
      const { model, version } = createCarDto;
      const slug = await this.generateUniqueSlugProvider.generateUniqueSlug(
        model,
        version,
      );

      await queryRunner.manager.save(carImages);
      const car = this.carRepository.create({
        ...createCarDto,
        slug,
        brand,
        carType,
        carImages,
      });
      await queryRunner.manager.save(car);
      await queryRunner.commitTransaction();
      return car;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (paths) {
        try {
          await this.filesService.deleteFiles(paths);
        } catch (fsError) {
          this.logger.error(
            `Failed to delete image: ${paths.join(', ')}`,
            fsError,
          );
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
