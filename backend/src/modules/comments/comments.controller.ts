import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CurrentUser, Public } from '../../common/decorators';

@ApiTags('comments')
@Controller()
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get('deals/:id/comments')
  @ApiOperation({ summary: 'Get comments for a deal' })
  async findByDeal(@Param('id') id: string) {
    return this.commentsService.findByDeal(id);
  }

  @Post('deals/:id/comments')
  @ApiOperation({ summary: 'Add a comment to a deal' })
  async create(
    @CurrentUser('id') userId: string,
    @Param('id') dealId: string,
    @Body('text') text: string,
    @Body('parentId') parentId?: string,
  ) {
    return this.commentsService.create(userId, dealId, text, parentId);
  }

  @Put('comments/:id')
  @ApiOperation({ summary: 'Update own comment' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body('text') text: string,
  ) {
    return this.commentsService.update(userId, id, text);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete own comment' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.remove(userId, id);
  }

  @Post('comments/:id/like')
  @ApiOperation({ summary: 'Like a comment' })
  async like(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.like(userId, id);
  }

  @Delete('comments/:id/like')
  @ApiOperation({ summary: 'Unlike a comment' })
  async unlike(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.unlike(userId, id);
  }
}
