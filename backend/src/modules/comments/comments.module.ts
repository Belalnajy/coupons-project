import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentLike } from './entities/comment.entity';

import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';

import { Deal } from '../deals/entities/deal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike, Deal]),
    SettingsModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
