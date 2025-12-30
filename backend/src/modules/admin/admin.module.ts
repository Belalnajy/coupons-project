import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminDealsController } from './controllers/admin-deals.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminStoresController } from './controllers/admin-stores.controller';
import { AdminCommentsController } from './controllers/admin-comments.controller';
import { AdminVotingController } from './controllers/admin-voting.controller';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminBannersController } from './controllers/admin-banners.controller';
import { AdminSettingsController } from './controllers/admin-settings.controller';
import { DealsModule } from '../deals/deals.module';
import { UsersModule } from '../users/users.module';
import { StoresModule } from '../stores/stores.module';
import { CommentsModule } from '../comments/comments.module';
import { VotesModule } from '../votes/votes.module';
import { ReportsModule } from '../reports/reports.module';
import { BannersModule } from '../banners/banners.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    DealsModule,
    UsersModule,
    StoresModule,
    CommentsModule,
    VotesModule,
    ReportsModule,
    BannersModule,
    SettingsModule,
  ],
  controllers: [
    AdminController,
    AdminDealsController,
    AdminUsersController,
    AdminStoresController,
    AdminCommentsController,
    AdminVotingController,
    AdminReportsController,
    AdminBannersController,
    AdminSettingsController,
  ],
})
export class AdminModule {}
