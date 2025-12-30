import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BannerStatus, BannerPlacement } from '../../../common/enums';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  subtitle: string | null;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'target_url', type: 'varchar', nullable: true })
  targetUrl: string | null;

  @Column({
    type: 'enum',
    enum: BannerPlacement,
    default: BannerPlacement.HOME_TOP,
  })
  placement: BannerPlacement;

  @Column({
    type: 'enum',
    enum: BannerStatus,
    default: BannerStatus.ACTIVE,
  })
  status: BannerStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
