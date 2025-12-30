import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment, CommentLike } from './entities/comment.entity';
import { Deal } from '../deals/entities/deal.entity';

import { CommentStatus } from '../../common/enums';

import { SettingsService } from '../settings/settings.service';
import { UsersService } from '../users/users.service';

@Injectable()
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  async findAllAdmin(query: {
    page: number;
    limit: number;
    status?: CommentStatus;
  }) {
    const { page, limit, status } = query;
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [data, total] = await this.commentRepository.findAndCount({
      where,
      relations: ['user', 'deal'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: string, status: CommentStatus) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    comment.status = status;
    return this.commentRepository.save(comment);
  }

  async removeAdmin(id: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    const dealId = comment.dealId;
    const result = await this.commentRepository.remove(comment);

    // Decrement comments count
    if (dealId) {
      await this.dealRepository.decrement({ id: dealId }, 'commentsCount', 1);
    }
    return result;
  }

  async findByDeal(dealId: string) {
    return this.commentRepository.find({
      where: { dealId, parentId: IsNull(), status: CommentStatus.APPROVED },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    userId: string,
    dealId: string,
    content: string,
    parentId?: string,
  ) {
    const isModerationOn = await this.settingsService.getBool(
      'comment_moderation',
      false,
    );

    const comment = this.commentRepository.create({
      userId,
      dealId,
      content,
      parentId,
      status: isModerationOn ? CommentStatus.PENDING : CommentStatus.APPROVED,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Increment comments count if approved (or maybe always? usually count reflects all or visible.
    // If moderation is on, maybe we wait? But users usually want to see "1 comment" immediately if it's theirs.
    // Let's increment regardless for now, or only if approved?
    // Standard practice: if pending, maybe don't show to public, so don't increment public count.
    // However, for simplicity and user feedback "I posted a comment", let's increment.
    // Actually, if we filter by status=APPROVED in findByDeal, the count should probably reflect that.
    // But let's keep it simple: count = total comments.

    if (!parentId) {
      // Only increment for top-level comments? Or all? Usually all.
      await this.dealRepository.increment({ id: dealId }, 'commentsCount', 1);
    }

    // Award karma for posting a comment
    await this.usersService.addKarma(userId, 2);

    return savedComment;
  }

  async update(userId: string, id: string, content: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    comment.content = content;
    return this.commentRepository.save(comment);
  }

  async remove(userId: string, id: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    const dealId = comment.dealId;
    const result = await this.commentRepository.softRemove(comment);

    if (dealId) {
      await this.dealRepository.decrement({ id: dealId }, 'commentsCount', 1);
    }
    return result;
  }

  async adminDelete(id: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    const dealId = comment.dealId;
    const result = await this.commentRepository.softRemove(comment);

    if (dealId) {
      await this.dealRepository.decrement({ id: dealId }, 'commentsCount', 1);
    }
    return result;
  }

  async like(userId: string, commentId: string) {
    const existingLike = await this.commentLikeRepository.findOne({
      where: { userId, commentId },
    });

    if (existingLike) {
      return { action: 'already_liked' };
    }

    const like = this.commentLikeRepository.create({ userId, commentId });
    await this.commentLikeRepository.save(like);

    await this.commentRepository.increment({ id: commentId }, 'likesCount', 1);

    // Award karma to comment author
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (comment && comment.userId !== userId) {
      // Don't award karma for self-likes (if UI allows it)
      await this.usersService.addKarma(comment.userId, 1);
    }

    return { action: 'liked' };
  }

  async unlike(userId: string, commentId: string) {
    const existingLike = await this.commentLikeRepository.findOne({
      where: { userId, commentId },
    });

    if (!existingLike) {
      return { action: 'not_liked' };
    }

    await this.commentLikeRepository.remove(existingLike);
    await this.commentRepository.decrement({ id: commentId }, 'likesCount', 1);

    return { action: 'unliked' };
  }
}
