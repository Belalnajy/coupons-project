import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 12, search = '' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.couponRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.store', 'store')
      .leftJoinAndSelect('coupon.user', 'user')
      .where('1=1');

    if (search) {
      queryBuilder.andWhere(
        '(coupon.title ILIKE :search OR coupon.code ILIKE :search OR store.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('coupon.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: ['store', 'user'],
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID "${id}" not found`);
    }

    return coupon;
  }

  async trackUsage(id: string) {
    const coupon = await this.findOne(id);
    coupon.useCount += 1;
    return this.couponRepository.save(coupon);
  }
}
