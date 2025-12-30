import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../../deals/entities/deal.entity';
import { User } from '../../users/entities/user.entity';
import { Report } from '../../reports/entities/report.entity';
import { Store } from '../../stores/entities/store.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  @Get('stats')
  async getStats() {
    const [totalDeals, totalUsers, pendingReports, totalStores] =
      await Promise.all([
        this.dealRepository.count(),
        this.userRepository.count(),
        this.reportRepository.count({ where: { status: 'pending' as any } }),
        this.storeRepository.count(),
      ]);

    const activeDeals = await this.dealRepository.count({
      where: { status: 'approved' as any },
    });
    const pendingDeals = await this.dealRepository.count({
      where: { status: 'pending' as any },
    });

    return {
      totalDeals,
      activeDeals,
      pendingDeals,
      totalUsers,
      pendingReports,
      totalStores,
    };
  }
}
