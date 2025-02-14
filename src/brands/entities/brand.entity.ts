import { Car } from 'src/cars/entities/car.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BrandImage } from './brand-image.entities';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 64,
  })
  name: string;

  @OneToMany(() => Car, (car) => car.brand)
  car: Car[];

  //TODO:Add relations with images
  @OneToOne(() => BrandImage, (brandImage) => brandImage.brand, {
    cascade: true,
    eager: true,
  })
  brandImage: BrandImage;
}
