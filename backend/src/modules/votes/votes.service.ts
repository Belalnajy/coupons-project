import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { Deal } from '../deals/entities/deal.entity';
import { VoteType } from '../../common/enums';
import { UsersService } from '../users/users.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly settingsService: SettingsService,
  ) {}

  async vote(userId: string, dealId: string, type: VoteType) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deal = await queryRunner.manager.findOne(Deal, {
        where: { id: dealId },
      });
      if (!deal) {
        throw new NotFoundException(`Deal with ID "${dealId}" not found`);
      }

      if (deal.isVotingFrozen) {
        throw new ForbiddenException('Voting is frozen for this deal');
      }

      const existingVote = await queryRunner.manager.findOne(Vote, {
        where: { userId, dealId },
      });

      let action: 'created' | 'removed' | 'changed' = 'created';
      let temperatureChange = 0;
      const increment = type === VoteType.HOT ? 1 : -1;

      // Check voting cooldown
      const cooldownHours = await this.settingsService.getInt(
        'vote_cooldown',
        24,
      );
      if (existingVote) {
        const lastUpdate = existingVote.updatedAt || existingVote.createdAt;
        const diffMs = Date.now() - new Date(lastUpdate).getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < cooldownHours && existingVote.type === type) {
          // If trying to remove the same vote too soon?
          // Usually removing is allowed, but changing types might be restricted.
          // Let's allow removing but restrict changing if within cooldown.
          // Actually, if existingVote.type === type, we REMOVE it.
          // If existingVote.type !== type, we CHANGE it.
        }

        if (existingVote.type !== type && diffHours < cooldownHours) {
          throw new ForbiddenException(
            `You can only change your vote once every ${cooldownHours} hours.`,
          );
        }
      }

      if (existingVote) {
        if (existingVote.type === type) {
          // Remove same vote
          await queryRunner.manager.remove(existingVote);
          temperatureChange = -increment;
          action = 'removed';
        } else {
          // Change vote type
          existingVote.type = type;
          await queryRunner.manager.save(existingVote);
          temperatureChange = increment * 2; // e.g., from -1 to +1 is +2
          action = 'changed';
        }
      } else {
        // New vote
        const vote = queryRunner.manager.create(Vote, { userId, dealId, type });
        await queryRunner.manager.save(vote);
        temperatureChange = increment;
        action = 'created';
      }

      // Update deal temperature
      deal.temperature += temperatureChange;
      await queryRunner.manager.save(deal);

      // Update karma (exclude self-voting if allowed)
      if (deal.userId !== userId) {
        // Since temperature logic aligns with karma logic (Hot=+1, Cold=-1),
        // we can reuse temperatureChange for karma.
        await this.usersService.addKarma(deal.userId, temperatureChange);
      }

      await queryRunner.commitTransaction();
      return { action, temperature: deal.temperature };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getVoteStatus(userId: string, dealId: string) {
    const vote = await this.voteRepository.findOne({
      where: { userId, dealId },
    });
    return vote ? { type: vote.type } : { type: null };
  }

  async getAnalytics() {
    const totalVotes = await this.voteRepository.count();
    const hotVotes = await this.voteRepository.count({
      where: { type: VoteType.HOT },
    });
    const coldVotes = await this.voteRepository.count({
      where: { type: VoteType.COLD },
    });

    const hottestDeal = await this.dealRepository.findOne({
      where: {},
      order: { temperature: 'DESC' },
    });

    return {
      totalVotes,
      hotVotes,
      coldVotes,
      hottestDeal,
    };
  }

  async freezeVoting(dealId: string) {
    const deal = await this.dealRepository.findOne({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');
    deal.isVotingFrozen = true;
    return this.dealRepository.save(deal);
  }

  async unfreezeVoting(dealId: string) {
    const deal = await this.dealRepository.findOne({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');
    deal.isVotingFrozen = false;
    return this.dealRepository.save(deal);
  }
}
