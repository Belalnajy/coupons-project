import { Controller, Get, Query } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannerPlacement } from '../../common/enums';
import { Public } from '../../common/decorators/public.decorator';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get()
  async getActive(@Query('placement') placement?: BannerPlacement) {
    return this.bannersService.findActive(placement);
  }
}
