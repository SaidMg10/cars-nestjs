import { Car } from 'src/cars/entities/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  //TODO: Relations with images
}
