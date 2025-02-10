import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  //TODO: Relations with images
}
