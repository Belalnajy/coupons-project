import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

import { StoreStatus } from '../../common/enums';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      where: { status: StoreStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findAllAdmin(query: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = query;
    const queryBuilder = this.storeRepository.createQueryBuilder('store');

    if (search) {
      queryBuilder.where(
        '(store.name ILIKE :search OR store.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('store.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException(`Store with ID "${id}" not found`);
    }
    return store;
  }

  async findBySlug(slug: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { slug } });
    if (!store) {
      throw new NotFoundException(`Store with slug "${slug}" not found`);
    }
    return store;
  }

  async create(data: Partial<Store>) {
    const store = this.storeRepository.create(data);
    return this.storeRepository.save(store);
  }

  async update(id: string, data: Partial<Store>) {
    const store = await this.findOne(id);
    Object.assign(store, data);
    return this.storeRepository.save(store);
  }

  async remove(id: string) {
    const store = await this.findOne(id);
    return this.storeRepository.remove(store);
  }
}
