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
import { UsersService } from '../../users/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, UserStatus } from '../../../common/enums';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllAdmin({ page, limit, search });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.usersService.createAdmin(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateAdmin(id, data);
  }

  @Put(':id/suspend')
  async suspend(@Param('id') id: string) {
    return this.usersService.updateStatus(id, UserStatus.SUSPENDED);
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string) {
    return this.usersService.updateStatus(id, UserStatus.ACTIVE);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.removeAdmin(id);
  }
}
