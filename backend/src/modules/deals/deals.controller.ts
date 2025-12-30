import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { DealQueryDto } from './dto/deal-query.dto';
import { CreateDealDto } from './dto/create-deal.dto';
import { Public, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  async create(
    @Body() createDealDto: CreateDealDto,
    @CurrentUser() user: User,
  ) {
    return this.dealsService.create(createDealDto, user);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List deals with filters' })
  async findAll(@Query() query: DealQueryDto) {
    return this.dealsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single deal details' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.dealsService.findOne(id);
  }
}
