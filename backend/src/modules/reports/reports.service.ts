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
    return this.reportRepository.find({
      where: query,
      relations: ['reporter', 'reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['reporter', 'reviewer'],
    });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }
    return report;
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
        switch (report.contentType) {
          case ReportContentType.DEAL:
            await this.dealsService.adminDelete(report.contentId);
            break;
          case ReportContentType.COMMENT:
            await this.commentsService.adminDelete(report.contentId);
            break;
          case ReportContentType.USER:
            await this.usersService.updateStatus(
              report.contentId,
              UserStatus.SUSPENDED,
            );
            break;
        }
      } catch (error) {
        // Log error but continue to save report status?
        // Or throw error? For now, let's allow it to fail if content not found (already handled in services)
        console.error(
          `Failed to take action on report ${id}: ${error.message}`,
        );
      }
    }

    return this.reportRepository.save(report);
  }
}
