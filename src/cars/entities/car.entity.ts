import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransmissionTypes } from '../enums/transmission-types.enum';
import { Brand } from 'src/brands/entities/brand.entity';
import { CarType } from 'src/car-types/entities/car-type.entity';
import { CarImage } from './car-image.entity';
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'model', type: 'varchar', length: 100 })
  model: string;

  @Column({ name: 'price', type: 'integer' })
  price: number;

  @Column({ name: 'version', type: 'varchar', length: 100 })
  version: string;

  @Column({ name: 'manufacturing_year', type: 'smallint' })
  manufacturingYear: number;

  @Column({ name: 'mileage', type: 'integer' })
  mileage: number;

  @Column({ name: 'transmission_type', type: 'enum', enum: TransmissionTypes })
  @Transform(
    ({ value }) => TransmissionTypes[value as keyof typeof TransmissionTypes],
  )
  transmissionType: TransmissionTypes;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //TODO: Relationships

  @ManyToOne(() => Brand, (brand) => brand.car, { eager: true })
  @Exclude()
  brand: Brand;

  @ManyToOne(() => CarType, (carType) => carType.car, { eager: true })
  @Exclude()
  carType: CarType;

  @OneToMany(() => CarImage, (carImage) => carImage.car, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  carImages: CarImage[];

  //TODO: BeforeInsert && BeforeUpdate
  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    if (this.slug) {
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
    }
  }

  //TODO: Serialization
  @Expose()
  get brandName(): string {
    return this.brand?.name;
  }

  @Expose()
  get carTypeName(): string {
    return this.carType?.name;
  }

  @Expose()
  get carImagesPath(): string[] {
    return this.carImages?.map((img) => img.path);
  }
}
