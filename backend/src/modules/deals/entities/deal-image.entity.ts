import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Deal } from './deal.entity';

@Entity('deal_images')
export class DealImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  url: string;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'deal_id' })
  dealId: string;

  @ManyToOne(() => Deal, (deal) => deal.images)
  @JoinColumn({ name: 'deal_id' })
  deal: Deal;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
