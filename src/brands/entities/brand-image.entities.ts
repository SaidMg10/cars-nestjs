import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './brand.entity';

@Entity('brand_images')
export class BrandImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  path: string;

  //TODO: Relations
  @OneToOne(() => Brand, (brand) => brand.brandImage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  brand: Brand;
}
