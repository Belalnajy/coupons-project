import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from '../../reports/reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  UserRole,
  ReportStatus,
  ReportContentType,
} from '../../../common/enums';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll(
    @Query('status') status?: ReportStatus,
    @Query('contentType') contentType?: ReportContentType,
  ) {
    return this.reportsService.findAll({ status, contentType });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Put(':id/review')
  async review(
    @Param('id') id: string,
    @CurrentUser() admin: User,
    @Body() data: { status: ReportStatus; notes?: string },
  ) {
    return this.reportsService.review(id, admin.id, data);
  }
}
