import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ReportContentType, ReportStatus } from '../../common/enums';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body()
    data: {
      contentType: ReportContentType;
      contentId: string;
      reason: string;
    },
  ) {
    return this.reportsService.create(user.id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Put(':id/review')
  async review(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: { status: ReportStatus; notes?: string },
  ) {
    return this.reportsService.review(id, user.id, data);
  }
}
