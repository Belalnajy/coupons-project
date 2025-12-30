import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { Deal } from './entities/deal.entity';
import { DealImage } from './entities/deal-image.entity';
import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deal, DealImage]),
    SettingsModule,
    UsersModule,
  ],
  providers: [DealsService],
  controllers: [DealsController],
  exports: [DealsService, TypeOrmModule],
})
export class DealsModule {}
