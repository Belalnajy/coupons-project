import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import {
  ReportStatus,
  ReportContentType,
  UserStatus,
} from '../../common/enums';
import { DealsService } from '../deals/deals.service';
import { CommentsService } from '../comments/comments.service';
import { UsersService } from '../users/users.service';
import { DealStatus, CommentStatus } from '../../common/enums';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly dealsService: DealsService,
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    reporterId: string,
    data: {
      contentType: ReportContentType;
      contentId: string;
      reason: string;
    },
  ) {
    const report = this.reportRepository.create({
      reporterId,
      ...data,
      status: ReportStatus.PENDING,
    });
    return this.reportRepository.save(report);
  }

  async findAll(query: {
    status?: ReportStatus;
    contentType?: ReportContentType;
  }) {
    const reports = await this.reportRepository.find({
      where: query,
      relations: ['reporter', 'reviewer'],
      order: { createdAt: 'DESC' },
    });

    return Promise.all(reports.map((report) => this.attachContentInfo(report)));
  }

  async findOne(id: string) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['reporter', 'reviewer'],
    });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }
    return this.attachContentInfo(report);
  }

  private async attachContentInfo(report: Report) {
    let content: any = null;
    try {
      switch (report.contentType) {
        case ReportContentType.DEAL:
          content = await this.dealsService.findOne(report.contentId, true);
          break;
        case ReportContentType.COMMENT:
          const commentRepository =
            this.reportRepository.manager.getRepository('Comment');
          content = await commentRepository.findOne({
            where: { id: report.contentId },
            relations: ['user', 'deal'],
          });
          break;
        case ReportContentType.USER:
          content = await this.usersService.findOne(report.contentId);
          break;
      }
    } catch (error) {
      content = null;
    }
    return { ...report, content };
  }

  async review(
    id: string,
    adminId: string,
    data: { status: ReportStatus; notes?: string },
  ) {
    const report = await this.findOne(id);
    report.status = data.status;
    report.notes = data.notes ?? null;
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();

    if (data.status === ReportStatus.RESOLVED) {
      try {
        let userId: string;
        switch (report.contentType) {
          case ReportContentType.DEAL:
            userId = report.content.userId;
            // Update deal status instead of deleting
            await this.reportRepository.manager
              .getRepository('Deal')
              .update(report.contentId, {
                status: DealStatus.REJECTED,
                isEnabled: false,
              });
            break;
          case ReportContentType.COMMENT:
            userId = report.content.userId;
            // Update comment status instead of deleting
            await this.reportRepository.manager
              .getRepository('Comment')
              .update(report.contentId, {
                status: CommentStatus.REJECTED,
              });
            break;
          case ReportContentType.USER:
            userId = report.contentId;
            break;
        }

        if (userId) {
          await this.usersService.updateStatus(userId, UserStatus.SUSPENDED);
        }
      } catch (error) {
        console.error(
          `Failed to take action on report ${id}: ${error.message}`,
        );
      }
    }

    return this.reportRepository.save(report);
  }
}
