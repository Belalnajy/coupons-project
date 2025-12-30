import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, AdminUpdateUserDto } from './dto';
import { UserLevel } from '../../common/enums';
import { Deal } from '../deals/entities/deal.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Vote } from '../votes/entities/vote.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    const user = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash,
      role: createUserDto.role,
    });

    return this.userRepository.save(user);
  }

  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check for duplicate username if changed
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.findByUsername(updateUserDto.username);
      if (existing) {
        throw new ConflictException('Username already taken');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<User> {
    return this.updateAdmin(id, dto);
  }

  async updateAdmin(id: string, dto: AdminUpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 12);
      delete dto.password;
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async findAllAdmin(query: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = query;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createAdmin(data: any) {
    return this.create(data);
  }

  async updateStatus(id: string, status: any) {
    const user = await this.findOne(id);
    user.status = status;
    return this.userRepository.save(user);
  }

  async removeAdmin(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async addKarma(id: string, points: number): Promise<void> {
    const user = await this.findOne(id);
    user.karma += points;
    user.level = this.calculateLevel(user.karma);
    await this.userRepository.save(user);
  }

  private calculateLevel(karma: number): UserLevel {
    if (karma >= 5000) return UserLevel.PLATINUM;
    if (karma >= 1000) return UserLevel.GOLD;
    if (karma >= 200) return UserLevel.SILVER;
    return UserLevel.BRONZE;
  }

  async getUserStats(id: string): Promise<any> {
    const user = await this.findOne(id);

    const dealsCount = await this.userRepository.manager.count(Deal, {
      where: { userId: id },
    });
    const commentsCount = await this.userRepository.manager.count(Comment, {
      where: { userId: id },
    });
    const votesCount = await this.userRepository.manager.count(Vote, {
      where: { userId: id },
    });

    return {
      karma: user.karma,
      level: user.level,
      dealsCount,
      commentsCount,
      votesCount,
      impactScore: Math.floor(user.karma / 10) + dealsCount * 5,
    };
  }

  async getMyDeals(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.userRepository.manager.findAndCount(Deal, {
      where: { userId },
      relations: ['category', 'store'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMyVotes(userId: string, page = 1, limit = 10) {
    const [data, total] = await this.userRepository.manager.findAndCount(Vote, {
      where: { userId },
      relations: ['deal', 'deal.store'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
