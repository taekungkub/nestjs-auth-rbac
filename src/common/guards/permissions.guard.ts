import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('Access denied');
    }

    // ❌ แบบ strict (ต้องมีทุก permission ที่กำหนด)
    if (!requiredPermissions.every((perm) => user.permissions.includes(perm))) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    // ✅ แบบ flexible (แค่มีหนึ่งใน permissions ที่กำหนดก็พอ)
    // if (!requiredPermissions.some((perm) => user.permissions.includes(perm))) {
    //   throw new ForbiddenException('You do not have the required permissions');
    // }

    return true;
  }
}
