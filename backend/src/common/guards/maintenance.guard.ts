import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SettingsService } from '../../modules/settings/settings.service';
import { UserRole } from '../enums';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private settingsService: SettingsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isMaintenanceMode = await this.settingsService.getBool(
      'maintenance_mode',
      false,
    );

    if (!isMaintenanceMode) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const url = request.url;

    // Allow admins to bypass maintenance mode
    if (user && user.role === UserRole.ADMIN) {
      return true;
    }

    // Allow auth routes so admins can login/logout
    if (url.includes('/api/auth')) {
      return true;
    }

    // Allow settings routes so frontend can check maintenance status
    if (url.includes('/api/settings')) {
      return true;
    }

    // Allow login/admin endpoints (optional, depending on auth strategy)
    // For now, we strict block everything except admin users (who likely need to login first)
    // Refinement: meaningful error
    throw new ServiceUnavailableException(
      'System is currently under maintenance. Please try again later.',
    );
  }
}
