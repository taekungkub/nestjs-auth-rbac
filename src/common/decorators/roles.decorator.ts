import { SetMetadata } from '@nestjs/common';
import { IRole } from '../types/role.type';

export const Roles = (...roles: IRole[] | [IRole[]]) => {
  const flatRoles = Array.isArray(roles[0]) ? roles[0] : roles;
  return SetMetadata('roles', flatRoles);
};
