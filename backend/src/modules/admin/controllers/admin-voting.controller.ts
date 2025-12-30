import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { VotesService } from '../../votes/votes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';

@Controller('admin/voting')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminVotingController {
  constructor(private readonly votesService: VotesService) {}

  @Get('analytics')
  async getAnalytics() {
    return this.votesService.getAnalytics();
  }

  @Put(':dealId/freeze')
  async freeze(@Param('dealId') dealId: string) {
    return this.votesService.freezeVoting(dealId);
  }

  @Put(':dealId/unfreeze')
  async unfreeze(@Param('dealId') dealId: string) {
    return this.votesService.unfreezeVoting(dealId);
  }
}
