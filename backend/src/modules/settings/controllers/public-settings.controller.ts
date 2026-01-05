import { Controller, Get } from '@nestjs/common';
import { SettingsService } from '../settings.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('settings')
@Public()
@Controller('settings/public')
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get public platform settings' })
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }
}
