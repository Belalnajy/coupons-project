import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { BannerStatus, BannerPlacement } from '../../common/enums';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async findAll(query: { status?: BannerStatus; placement?: BannerPlacement }) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.placement) where.placement = query.placement;

    return this.bannerRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findActive(placement?: BannerPlacement) {
    const now = new Date();
    const query = this.bannerRepository
      .createQueryBuilder('banner')
      .where('banner.status = :status', { status: BannerStatus.ACTIVE });

    if (placement) {
      query.andWhere('banner.placement = :placement', { placement });
    }

    // Optional: Filter by date if start/end dates are provided
    query
      .andWhere('(banner.startDate IS NULL OR banner.startDate <= :now)', {
        now,
      })
      .andWhere('(banner.endDate IS NULL OR banner.endDate >= :now)', { now });

    return query.orderBy('banner.sortOrder', 'ASC').getMany();
  }

  async findOne(id: string) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID "${id}" not found`);
    }
    return banner;
  }

  async create(data: Partial<Banner>) {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async update(id: string, data: Partial<Banner>) {
    const banner = await this.findOne(id);
    Object.assign(banner, data);
    return this.bannerRepository.save(banner);
  }

  async remove(id: string) {
    const banner = await this.findOne(id);
    return this.bannerRepository.remove(banner);
  }
}
