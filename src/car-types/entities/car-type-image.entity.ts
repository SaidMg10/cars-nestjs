import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarType } from './car-type.entity';

@Entity('car_type_image')
export class CarTypeImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  path: string;

  @OneToOne(() => CarType, (carType) => carType.carTypeImage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  carType: CarType;
}
