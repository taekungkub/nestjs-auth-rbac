import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ดึง role ที่ต้องการจาก @Roles()
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // ถ้าไม่มี @Roles() ถือว่า public
    }

    // ดึง user จาก request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('👤 User from JWT:', user);

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied');
    }

    // ตรวจสอบว่า user มี role ตรงกับ requiredRoles หรือไม่
    const hasRole = user.roles.some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }

    return hasRole;
  }
}
