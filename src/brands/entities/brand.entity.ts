import { Car } from 'src/cars/entities/car.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Car, (car) => car.brand, { eager: true })
  car: Car;
  //TODO:Add relations with images
}
