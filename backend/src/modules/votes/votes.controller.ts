import { Controller, Post, Delete, Param, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CurrentUser, Public } from '../../common/decorators';
import { VoteType } from '../../common/enums';

@ApiTags('votes')
@Controller('deals/:id/vote')
@ApiBearerAuth()
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @ApiOperation({ summary: 'Cast or change vote on a deal' })
  async vote(
    @CurrentUser('id') userId: string,
    @Param('id') dealId: string,
    @Body('type') type: VoteType,
  ) {
    return this.votesService.vote(userId, dealId, type);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current user vote status for a deal' })
  async getStatus(
    @CurrentUser('id') userId: string,
    @Param('id') dealId: string,
  ) {
    return this.votesService.getVoteStatus(userId, dealId);
  }
}
