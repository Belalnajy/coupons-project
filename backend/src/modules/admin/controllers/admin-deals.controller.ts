import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DealsService } from '../../deals/deals.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, DealStatus } from '../../../common/enums';
import { DealQueryDto } from '../../deals/dto/deal-query.dto';

@Controller('admin/deals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminDealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  async findAll(@Query() query: DealQueryDto) {
    return this.dealsService.findAll(query, true);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const deal = await this.dealsService.findOne(id);
    if (!deal) {
      throw new NotFoundException(`Deal with ID "${id}" not found`);
    }
    return deal;
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.dealsService.updateStatus(id, DealStatus.APPROVED);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.dealsService.updateStatus(id, DealStatus.REJECTED);
  }

  @Put(':id/toggle')
  async toggle(@Param('id') id: string) {
    return this.dealsService.toggleEnabled(id);
  }

  @Put(':id/verify')
  async verify(@Param('id') id: string) {
    return this.dealsService.toggleVerified(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.dealsService.removeAdmin(id);
  }
}
