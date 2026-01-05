import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { SettingsService } from '../../settings/settings.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAll() {
    return this.settingsService.findAll();
  }

  @Put(':key')
  async update(
    @Param('key') key: string,
    @Body() data: { value: any; description?: string },
  ) {
    return this.settingsService.update(key, data.value, data.description);
  }

  @Post('reset')
  async resetToDefaults() {
    return this.settingsService.resetToDefaults();
  }

  @Post('clear-cache')
  async clearCache() {
    return this.settingsService.clearSystemCache();
  }
}
