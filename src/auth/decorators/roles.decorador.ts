import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'rol';
export const Roles = (...roles: Array<'admin' | 'invitado'>) =>
  SetMetadata(ROLES_KEY, roles);