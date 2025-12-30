import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from '../../comments/comments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, CommentStatus } from '../../../common/enums';

@Controller('admin/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: CommentStatus,
  ) {
    return this.commentsService.findAllAdmin({ page, limit, status });
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.commentsService.updateStatus(id, CommentStatus.APPROVED);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentsService.removeAdmin(id);
  }
}
