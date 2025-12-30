import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { SettingsService } from '../settings/settings.service';
import { Public } from '../../common/decorators';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    private readonly settingsService: SettingsService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all coupons' })
  async findAll(@Query() query: any) {
    const couponsEnabled = await this.settingsService.getBool(
      'coupons_enabled',
      true,
    );
    if (!couponsEnabled) {
      throw new ForbiddenException('Coupons section is currently disabled');
    }
    return this.couponsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  async findOne(@Param('id') id: string) {
    const couponsEnabled = await this.settingsService.getBool(
      'coupons_enabled',
      true,
    );
    if (!couponsEnabled) {
      throw new ForbiddenException('Coupons section is currently disabled');
    }
    return this.couponsService.findOne(id);
  }

  @Post(':id/use')
  @ApiOperation({ summary: 'Track coupon usage' })
  async trackUsage(@Param('id') id: string) {
    return this.couponsService.trackUsage(id);
  }
}
