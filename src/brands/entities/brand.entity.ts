import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  //TODO:Add relations with images
}
