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
  NotFoundException,
} from '@nestjs/common';
import { StoresService } from '../../stores/stores.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, StoreStatus } from '../../../common/enums';

@Controller('admin/stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminStoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.storesService.findAllAdmin({ page, limit, search });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.storesService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.storesService.update(id, data);
  }

  @Put(':id/toggle')
  async toggle(@Param('id') id: string) {
    const store = await this.storesService.findOne(id);
    const newStatus =
      store.status === StoreStatus.ACTIVE
        ? StoreStatus.DISABLED
        : StoreStatus.ACTIVE;
    return this.storesService.update(id, { status: newStatus });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
