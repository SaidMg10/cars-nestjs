import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { BrandService } from 'src/brands/brands.service';
import { UpdateCarDto } from '../dto/update-car.dto';
import { CarTypesService } from 'src/car-types/car-types.service';
import { CarImage } from '../entities';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UpdateCarProvider {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,

    @InjectRepository(CarImage)
    private readonly carImageRepository: Repository<CarImage>,

    private readonly logger: Logger,

    private readonly brandService: BrandService,

    private readonly carTypeService: CarTypesService,

    private readonly filesService: FilesService,

    private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(UpdateCarProvider.name);
  }
  async update(
    id: string,
    updateCarDto: UpdateCarDto,
    files: Array<Express.Multer.File>,
  ): Promise<Car> {
    const { brand, carType, ...toUpdate } = updateCarDto;

    const car = await this.carRepository.preload({
      id,
      ...toUpdate,
    });
    if (!car) throw new NotFoundException('The car Id does not exist');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let oldImagesPaths: string[] = [];
    try {
      if (brand) {
        const brandExist = await this.brandService.findOne(brand);
        if (!brandExist) throw new NotFoundException('Brand not found');
        car.brand = brandExist;
      }

      if (carType) {
        const carTypeExist = await this.carTypeService.findOne(carType);
        if (!carTypeExist) throw new NotFoundException('Car type not found');
        car.carType = carTypeExist;
      }

      if (files && files.length > 0) {
        const existingImages = await queryRunner.manager.find(CarImage, {
          where: { car: { id } },
        });

        if (existingImages && existingImages.length > 0) {
          oldImagesPaths = existingImages.map((img) => img.path);

          const uploadResults = await this.filesService.uploadImages(files);
          const newImagePaths = uploadResults.map((result) => result.filePath);

          for (
            let i = 0;
            i < Math.min(existingImages.length, newImagePaths.length);
            i++
          ) {
            existingImages[i].path = newImagePaths[i];
            await queryRunner.manager.save(existingImages[i]);
          }

          if (existingImages.length > newImagePaths.length) {
            const imagesToDelete = existingImages.slice(newImagePaths.length);
            oldImagesPaths.push(...imagesToDelete.map((img) => img.path));
            await queryRunner.manager.remove(imagesToDelete);
          }

          if (newImagePaths.length > existingImages.length) {
            const newImages = newImagePaths
              .slice(existingImages.length)
              .map((path) => this.carImageRepository.create({ path, car }));

            await queryRunner.manager.save(newImages);
          }
        } else {
          const uploadResults = await this.filesService.uploadImages(files);
          const newImagePaths = uploadResults.map((result) => result.filePath);

          const newImages = newImagePaths.map((path) =>
            this.carImageRepository.create({ path, car }),
          );

          await queryRunner.manager.save(newImages);
        }
      }

      await queryRunner.manager.save(car);

      if (oldImagesPaths.length > 0) {
        try {
          await this.filesService.deleteFiles(oldImagesPaths);
        } catch (fsError) {
          this.logger.error(
            `Failed to delete old images: ${oldImagesPaths.join(', ')}`,
            fsError,
          );
        }
      }

      await queryRunner.commitTransaction();

      await queryRunner.release();

      const updatedCar = await this.carRepository.findOne({
        where: { id },
        relations: ['carImages'],
      });

      if (!updatedCar) {
        throw new NotFoundException('Car not found after update');
      }
      return updatedCar;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error updating car:', error);
      throw new InternalServerErrorException(
        'An internal error occurred while updating the car',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
