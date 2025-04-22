import { SetMetadata } from '@nestjs/common';
import { IPermission } from '../types/permission.type';

export const Permissions = (...roles: IPermission[] | [IPermission[]]) => {
  const flatPermissions = Array.isArray(roles[0]) ? roles[0] : roles;
  return SetMetadata('permissions', flatPermissions);
};
