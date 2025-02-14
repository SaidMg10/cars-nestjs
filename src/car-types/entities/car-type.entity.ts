import { Car } from 'src/cars/entities/car.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarTypeImage } from './car-type-image.entity';

@Entity('car_types')
export class CarType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 56,
    unique: true,
  })
  name: string;

  @OneToMany(() => Car, (car) => car.carType)
  car: Car[];

  //TODO: Relationship Images CarType

  @OneToOne(() => CarTypeImage, (carTypeImage) => carTypeImage.carType, {
    eager: true,
    cascade: true,
  })
  carTypeImage: CarTypeImage;
}
