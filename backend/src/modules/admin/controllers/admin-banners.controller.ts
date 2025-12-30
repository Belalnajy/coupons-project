import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BannersService } from '../../banners/banners.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, BannerStatus, BannerPlacement } from '../../../common/enums';

@Controller('admin/banners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  async findAll(
    @Query('status') status?: BannerStatus,
    @Query('placement') placement?: BannerPlacement,
  ) {
    return this.bannersService.findAll({ status, placement });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.bannersService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}
