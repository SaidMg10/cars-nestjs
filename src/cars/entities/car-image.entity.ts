import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from './car.entity';

@Entity('car_images')
export class CarImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: false,
  })
  path: string;

  @ManyToOne(() => Car, (car) => car.carImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  car: Car;
}
