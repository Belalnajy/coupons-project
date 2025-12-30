import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { DealQueryDto } from './dto/deal-query.dto';
import { DealStatus, VoteType } from '../../common/enums';

import { DealImage } from './entities/deal-image.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { User } from '../users/entities/user.entity';

import { SettingsService } from '../settings/settings.service';
import { UsersService } from '../users/users.service';
// ... existing imports

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(DealImage)
    private readonly dealImageRepository: Repository<DealImage>,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createDealDto: CreateDealDto, user: User) {
    const dealsEnabled = await this.settingsService.getBool(
      'deals_enabled',
      true,
    );
    if (!dealsEnabled) {
      throw new ForbiddenException('Deals section is currently disabled');
    }

    const {
      images,
      category,
      store,
      expiryDate,
      originalPrice,
      dealPrice,
      whatsIncluded,
      howToGet,
      storeName,
      ...dealData
    } = createDealDto;

    let discountPercentage = 0;
    if (originalPrice && dealPrice && originalPrice > 0) {
      discountPercentage = ((originalPrice - dealPrice) / originalPrice) * 100;
    }

    // Check auto-approve setting
    const autoApproveVerified = await this.settingsService.getBool(
      'auto_approve_verified',
      true,
    );

    // Determine initial status
    let initialStatus = DealStatus.PENDING;
    // If user is admin, auto approve
    if (user.role === UserRole.ADMIN) {
      initialStatus = DealStatus.APPROVED;
    }
    // If auto-approve is on and user is somewhat trusted (e.g. verified or specific role/level if we had it)
    // For now assuming all authenticated users are "verified" enough if the setting is on,
    // OR we could check user.isVerified if that field existed.
    // Let's assume we check if the user is verified implementation-wise, or just fallback to approved if setting is true for now
    else if (autoApproveVerified) {
      initialStatus = DealStatus.APPROVED;
    }

    const deal = this.dealRepository.create({
      ...dealData,
      originalPrice,
      dealPrice,
      discountPercentage,
      whatsIncluded,
      howToGet,
      storeName,
      status: initialStatus,
      user: { id: user.id } as User,
      store: store ? { id: store } : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    });

    const savedDeal = await this.dealRepository.save(deal);

    // ... save images ...
    if (images && images.length > 0) {
      const imageEntities = images.map((url, index) =>
        this.dealImageRepository.create({
          dealId: savedDeal.id,
          url: url,
          sortOrder: index,
        }),
      );
      await this.dealImageRepository.save(imageEntities);
    }

    // Award karma for posting a deal
    await this.usersService.addKarma(user.id, 10);

    return this.findOne(savedDeal.id);
  }

  async findAll(query: DealQueryDto, isAdmin = false) {
    if (!isAdmin) {
      const dealsEnabled = await this.settingsService.getBool(
        'deals_enabled',
        true,
      );
      if (!dealsEnabled) {
        // Return empty data if disabled for public
        return {
          data: [],
          total: 0,
          page: 1,
          limit: query.limit || 12,
          totalPages: 0,
        };
      }
    }

    const {
      page = 1,
      limit = 12,
      sort = 'newest',
      search,
      category,
      store,
      status,
      minPrice,
      maxPrice,
      minDiscount,
      isVerified,
      isExpiringSoon,
      freeDelivery,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.dealRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.user', 'user')
      .leftJoinAndSelect('deal.category', 'category')
      .leftJoinAndSelect('deal.store', 'store')
      .leftJoinAndSelect('deal.images', 'images')
      .loadRelationCountAndMap(
        'deal.commentsCount',
        'deal.comments',
        'commentsCount',
      )
      .loadRelationCountAndMap(
        'deal.hotVotes',
        'deal.votes',
        'hotVotes',
        (qb) => qb.where('hotVotes.type = :hotType', { hotType: VoteType.HOT }),
      )
      .loadRelationCountAndMap(
        'deal.coldVotes',
        'deal.votes',
        'coldVotes',
        (qb) =>
          qb.where('coldVotes.type = :coldType', { coldType: VoteType.COLD }),
      );

    if (!isAdmin) {
      queryBuilder.andWhere('deal.isEnabled = :isEnabled', { isEnabled: true });
      queryBuilder.andWhere('deal.status = :status', {
        status: DealStatus.APPROVED,
      });
    } else if (status) {
      queryBuilder.andWhere('deal.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(deal.title ILIKE :search OR deal.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('category.slug = :category', { category });
    }

    if (store) {
      queryBuilder.andWhere('deal.storeId = :store', { store });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('deal.dealPrice >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('deal.dealPrice <= :maxPrice', { maxPrice });
    }

    if (minDiscount !== undefined) {
      queryBuilder.andWhere('deal.discountPercentage >= :minDiscount', {
        minDiscount,
      });
    }

    if (isVerified) {
      queryBuilder.andWhere('deal.isVerified = :isVerified', { isVerified });
    }

    if (freeDelivery) {
      queryBuilder.andWhere('deal.freeDelivery = :freeDelivery', {
        freeDelivery,
      });
    }

    if (isExpiringSoon) {
      const soon = new Date();
      soon.setDate(soon.getDate() + 3); // 3 days window
      queryBuilder.andWhere('deal.expiryDate >= :now', { now: new Date() });
      queryBuilder.andWhere('deal.expiryDate <= :soon', { soon });
    }

    // Sorting Logic
    switch (sort) {
      case 'newest':
        queryBuilder.orderBy('deal.createdAt', 'DESC');
        break;
      case 'hottest':
        queryBuilder.orderBy('deal.temperature', 'DESC');
        break;
      case 'closing':
        queryBuilder.andWhere('deal.expiryDate IS NOT NULL');
        queryBuilder.orderBy('deal.expiryDate', 'ASC');
        break;
      case 'popular':
        queryBuilder.orderBy('deal.commentsCount', 'DESC');
        break;
      default:
        queryBuilder.orderBy('deal.createdAt', 'DESC');
    }

    const [data, total] = await queryBuilder
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

  async findOne(id: string, isAdmin = false): Promise<Deal> {
    const queryBuilder = this.dealRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.user', 'user')
      .leftJoinAndSelect('deal.category', 'category')
      .leftJoinAndSelect('deal.store', 'store')
      .leftJoinAndSelect('deal.images', 'images')
      .leftJoinAndSelect('deal.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .loadRelationCountAndMap(
        'deal.hotVotes',
        'deal.votes',
        'hotVotes',
        (qb) => qb.where('hotVotes.type = :hotType', { hotType: VoteType.HOT }),
      )
      .loadRelationCountAndMap(
        'deal.coldVotes',
        'deal.votes',
        'coldVotes',
        (qb) =>
          qb.where('coldVotes.type = :coldType', { coldType: VoteType.COLD }),
      )
      .where('deal.id = :id', { id });

    if (!isAdmin) {
      queryBuilder.andWhere('deal.isEnabled = :isEnabled', { isEnabled: true });
    }

    const deal = await queryBuilder.getOne();

    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }

    // Increment views count
    if (!isAdmin) {
      await this.dealRepository.increment({ id }, 'viewsCount', 1);
    }

    return deal;
  }

  async updateStatus(id: string, status: DealStatus) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }
    deal.status = status;
    return this.dealRepository.save(deal);
  }

  async removeAdmin(id: string) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }
    return this.dealRepository.softRemove(deal);
  }

  async adminDelete(id: string) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }
    return this.dealRepository.softRemove(deal);
  }

  async toggleEnabled(id: string) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }
    deal.isEnabled = !deal.isEnabled;
    return this.dealRepository.save(deal);
  }

  async toggleVerified(id: string) {
    const deal = await this.dealRepository.findOne({ where: { id } });
    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }
    deal.isVerified = !deal.isVerified;
    return this.dealRepository.save(deal);
  }
}
