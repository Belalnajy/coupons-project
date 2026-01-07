import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { slugify } from '../../../common/utils/slugify';
import { StoreStatus } from '../../../common/enums';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'logo_url', nullable: true, length: 500 })
  logoUrl: string;

  @Column({ name: 'website_url', nullable: true, length: 500 })
  websiteUrl: string;

  @Column({
    type: 'enum',
    enum: StoreStatus,
    default: StoreStatus.ACTIVE,
  })
  status: StoreStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  slugifyName() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
