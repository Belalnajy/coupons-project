import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const url = context.switchToHttp().getRequest().url;
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(`JwtAuthGuard: URL=${url}, isPublic=${isPublic}`);

    if (isPublic) {
      return true;
    }

    const result = await super.canActivate(context);
    console.log(`JwtAuthGuard: Success for ${url}`);
    return result as boolean;
  }
}

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
