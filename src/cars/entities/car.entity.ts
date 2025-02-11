import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransmissionTypes } from '../enums/transmission-types.enum';
import { Brand } from 'src/brands/entities/brand.entity';

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
  brand: Brand;
  //   carType: string;
  //   Images: string[];

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
}
