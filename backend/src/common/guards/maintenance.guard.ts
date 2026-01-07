import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SettingsService } from '../../modules/settings/settings.service';
import { UserRole } from '../enums';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

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

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const url = request.url;
    const hasAuthHeader = !!request.headers['authorization'];

    console.log('--- MaintenanceGuard Debug ---');
    console.log(`URL: ${url}`);
    console.log(`Has Auth Header: ${hasAuthHeader}`);
    console.log(`User Object Exists: ${!!user}`);
    if (user) {
      console.log(`User Email: ${user.email}`);
      console.log(`User Role: ${user.role}`);
      console.log(`Enum Admin Role: ${UserRole.ADMIN}`);
      console.log(
        `Match? ${user.role === UserRole.ADMIN || user.role === 'admin'}`,
      );
    }
    console.log('------------------------------');

    // Allow admins to bypass maintenance mode
    if (user && (user.role === UserRole.ADMIN || user.role === 'admin')) {
      console.log('MaintenanceGuard: Admin bypass granted');
      return true;
    }

    // Allow auth routes so admins can login/logout
    if (url.includes('/auth/')) {
      return true;
    }

    // Allow settings/public route so frontend can check maintenance status
    // This is crucial for the frontend to even know it should show the maintenance page
    if (url.includes('/settings/public')) {
      return true;
    }

    // Even if it's @Public, we might want to block it during maintenance
    // BUT we must allow the essential ones above.
    // If it's @Public and NOT one of the above, we still block it to enforce maintenance.

    throw new ServiceUnavailableException(
      'System is currently under maintenance. Please try again later.',
    );
  }
}
